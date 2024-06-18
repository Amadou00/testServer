const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

// Directory with your PDF files
let pdfDirectory = "../pdf/";

// Read all files in the directory
fs.readdir(pdfDirectory, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  // Filter PDF files
  let pdfFiles = files.filter((file) => path.extname(file).toLowerCase() === ".pdf");

  // Accumulator for all results
  let allResults = [];

  // Process each PDF file
  let promises = pdfFiles.map((file, index) => {
    return new Promise((resolve, reject) => {
      console.log(`Processing file: ${file}`);
      let dataBuffer = fs.readFileSync(path.join(pdfDirectory, file));

      pdf(dataBuffer)
        .then(function (data) {
          if (!data) {
            console.log(`Failed to convert PDF to text: ${file}`);
            reject(`Failed to convert PDF to text: ${file}`);
          }

          let pages = data.text.split(/\s*\f\s*/);

          let result = pages.map((pageText, pageIndex) => {
            let numberFile = file.split("-").pop().split(".")[0];
            let contents = pageText.split(/\s*\r?\n/);
            // Counters for the different sections
            let descriptionCounter = 1,
              terms_of_useCounter = 1,
              rangeCounter = 1,
              techCharacCounter = 1,
              certificationsCounter = 1;
            // Flags to determine the current section
            let isTechCharac = false,
              isRange = false;
              

            let contentObjects = contents.reduce((acc, content, i) => {
              if (content) {
                let key;
                key = `text${i}`;
                if (content.trim().includes(" Conseils d’utilisation")) {
                  key = "terms_of_use";
                  acc[key] = {};
                } else if (content.trim().includes(" Gamme")) {
                  key = "range";
                  acc[key] = {};
                  isRange = true;
                  // rangeCounter = 1; // Reset the counter
                } else if (content.trim().includes(" Caractéristiques techniques")) {
                  key = "tech_charac";
                  acc[key] = acc[key] || {}; // Use the existing object if it exists
                  isRange = false;
                  isTechCharac = true;
                } else if (content.trim().includes("Configuration maximale admissible")) {
                  let parts = content.trim().split("Configuration maximale admissible");
                  if (parts.length > 1) {
                    acc["range"]["cma"] = parts[1].trim(); // Take the text after "Configuration maximale admissible"
                  }
                } else if (content.trim().includes("la source (Mfb)")) {
                  let parts = content.trim().split("la source (Mfb)");
                  if (parts.length > 1) {
                    acc["range"]["mfb"] = parts[1].trim(); // Take the text after "la source (Mfb)"
                  }
                } else if (content.trim().includes("Angle maximal d’orientation pour conformité arrêté ")) {
                  let parts = content.trim().split("Angle maximal d’orientation pour conformité arrêté ");
                  if (parts.length > 1) {
                    acc["range"]["angle"] = parts[1].trim(); // Take the text after "Angle maximal d’orientation pour conformité arrêté "
                  }
                } else if (content.trim() === "*" || content.trim() === "Couleur" || content.trim().endsWith("00K")) {
                  acc["range"]["temperature"] = acc["range"]["temperature"] || {};
                  let colorIndex = Object.keys(acc["range"]["temperature"]).length + 1;
                  acc["range"]["temperature"][`text${colorIndex}`] = content.trim();
                } else if (i === 4) {
                  key = "title";

                  // Split the title into phrases
                  let phrases = content.match(/[^\.!\?]+[\.!\?]+/g);

                  // If the title could be split into phrases
                  if (phrases) {
                    // Remove duplicate phrases
                    let uniquePhrases = [...new Set(phrases)];

                    // Join the unique phrases back together
                    content = uniquePhrases.join(" ");
                  }

                  // Remove any strings within "«...»"
                  let contentWithoutQuotes = content.replace(/«.*?»/g, "");

                  // Regular expression to match uppercase characters not between "«...»"
                  let regex = /[A-Z]{2,}/g;

                  // Find matches in the title
                  let matches = contentWithoutQuotes.match(regex);

                  // If there are matches, add them to the manu_name property and remove them from the title
                  if (matches) {
                    acc["manu_name"] = matches.join(" ");
                    matches.forEach((match) => {
                      content = content.replace(match, "");
                    });
                  }
                } else if (acc.terms_of_use && !acc.range) {
                  key = `text${terms_of_useCounter++}`;
                  acc.terms_of_use[key] = content.trim();
                  return acc;
                } else if (acc.title && !acc.terms_of_use) {
                  key = `text${descriptionCounter++}`;
                  acc.description = acc.description || {};
                  acc.description[key] = content.trim();
                  return acc;
                } else if (
                  content.trim() === "A" ||
                  content.trim() === "B" ||
                  content.trim().includes("IP ") ||
                  content.trim().includes("ULOR ") ||
                  content.trim().includes("IK ") ||
                  content.trim().includes("CL ")
                ) {
                  isTechCharac = false;
                }

                if (isRange) {
                  key = `text${rangeCounter++}`;
                  acc.range[key] = content.trim();
                  return acc;
                }
                if (isTechCharac) {
                  key = `text${techCharacCounter++}`;
                  acc.tech_charac[key] = content.trim();
                  return acc;
                } else if (
                  content.trim().includes("IP ") ||
                  content.trim().includes("ULOR ") ||
                  content.trim().includes("IK ") ||
                  content.trim().includes("CL ")
                ) {
                  key = `text${certificationsCounter++}`;
                  acc.certifications = acc.certifications || {};
                  acc.certifications[key] = content.trim();
                } else if (!isTechCharac && key.startsWith("text")) {
                  acc[key] = content.trim();
                  return acc;
                }
                if (key !== "terms_of_use" && key !== "range") {
                  acc[key] = (acc[key] || "") + " " + content.trim();
                }
              }
              return acc;
            }, {});

            return {
              page: numberFile,
              ...contentObjects,
            };
          });

          // Resolve the promise with the result for this file
          resolve(result);
        })
        .catch(function (error) {
          console.log(`Error processing file ${file}: ${error}`);
          reject(error);
        });
    });
  });
  Promise.all(promises)
    .then((results) => {
      // Flatten the array of results and add to the allResults array
      allResults.push(...[].concat(...results));

      // Save all results into a JSON file
      fs.writeFileSync("./data.json", JSON.stringify(allResults, null, 2));
    })
    .catch((error) => {
      console.log(`Error processing files: ${error}`);
    });
});

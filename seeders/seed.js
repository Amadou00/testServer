const fs = require("fs");
const db = require("../config/database");
// Import the model
const Manufacturer = require("../models/Manufacturer");
const PLs = require("../models/PL");
const Products = require("../models/Products");
const TempColors = require("../models/TempColors");
const { col } = require("sequelize");
const Certifications = require("../models/Certifications");
const Gamme_temp_colors = require("../models/gamme_temp_colors");
const PL_Certifications = require("../models/PL_Certifications");

// Connect to the database
db.authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

// Read the data from the data.json file
const data = JSON.parse(fs.readFileSync("../datas/data.json", "utf8"));

// Extract all manu_name values from the data array
const items = data.map((item) => item);

let excludedKeysRange = ["cma", "mfb", "angle", "temperature"];
/**
 * Get a description from an object, excluding some keys
 * @param {Object} obj - The object to extract the description from
 * @param {Array} excludedKeys - The keys to exclude
 * @returns {string} The description
 *  */
function getDescriptionFromObject(obj, excludedKeys) {
  let description = "";
  for (let key in obj) {
    if (!excludedKeys.includes(key)) {
      description += obj[key] + "\n ";
    }
  }
  return description;
}
/**
 * Get the manufacturer id from the manufacturer name
 * @returns {Promise<number>} The manufacturer id
 */
async function setManuId(item) {
  const manufacturer = await Manufacturer.findOne({
    where: { manu_name: item.manu_name },
  });
  if (manufacturer) {
    return manufacturer.manu_id;
  } else {
    console.log(`Manufacturer with name ${item.manu_name} not found`);
  }
}
/**
 * Get the product id from the product label
 * @returns {Promise<number>} The product id
 */
async function getproductId(item) {
  const product = await Products.findOne({
    where: { product_label: item.title },
  });
  if (product) {
    return product.product_id;
  } else {
    console.log(`Product with name ${item.title} not found`);
  }
}
/**
 * Extract temps from an object
 * @param {Object} obj - The object to extract the temps from
 * @returns {Array} The temps
 *  */
function extractTempFromObject(obj) {
  let temps = new Map();
  let previousTemp = null;
  for (let key in obj) {
    let splitTemps = obj[key].split(" ");
    for (let temp of splitTemps) {
      if (temp === "*" || (temp.length !== 5 && temp !== "Couleur")) {
        previousTemp = temp;
        continue;
      }
      if (!temps.has(temp)) {
        if (previousTemp === "*") {
          temps.set(temp, true);
        } else {
          temps.set(temp, false);
        }
      }
      previousTemp = temp;
    }
  }
  return Array.from(temps, ([temp, value]) => [temp, value]);
}

/**
 * Extract certifications from an object
 * @param {Object} obj - The object to extract the certifications from
 * @returns {Array} The certifications
 * */
function extractCertificationsFromObject(obj) {
  let certifications = new Set();
  for (let key in obj) {
    let splitCertification = obj[key].split("\n");
    splitCertification.forEach((certification) => certifications.add(certification));
  }
  return Array.from(certifications);
}

// Remove duplicates
const uniqueManuNames = [...new Set(items.map((item) => item.manu_name))];

//Insert unique manu_names into the Manufacturer table
const manufacturerPromises = uniqueManuNames.map(async (manuName) => {
  try {
    const [manufacturer, created] = await Manufacturer.findOrCreate({
      where: { manu_name: manuName },
    });

    if (created) {
      console.log(`Created manufacturer: ${manuName}`);
    }
  } catch (error) {
    console.error(`Error creating manufacturer: ${manuName}`, error);
  }
});

// Insert Product and PL into the database
Promise.all(manufacturerPromises).then(async () => {
  const first = items.map(async (item) => {
    (async () => {
      try {
        const Product = await Products.create({
          product_label: item.title,
          product_model: "",
          product_delete: false,
          cat_id: 2,
          manu_id: await setManuId(item),
        });
        console.log(`Created product label: ${Product.product_label}`);
      } catch (error) {
        console.error(`Error creating product label: ${items.title}`, error);
      }

      // Insert PL into the database
      try {
        const PL = await PLs.create({
          product_id: await getproductId(item),
          PL_range_description: await getDescriptionFromObject(item.range, excludedKeysRange),
          PL_range_mfb: item.range.mfb,
          PL_range_max_allow_config: item.range.cma,
          PL_range_max_angle: item.angle,
          PL_description: await getDescriptionFromObject(item.description, ""),
          PL_tech_charac: await getDescriptionFromObject(item.tech_charac, ""),
          PL_terms_of_use: await getDescriptionFromObject(item.terms_of_use, ""),
          PL_num_page: item.page,
          cat_id: 1,
        });
        // Insert TempColors into the database
        let temps = extractTempFromObject(item.range.temperature);
        let productId = await getproductId(item);
        const TempColorsPromises = temps.map(async (temp) => {
          let [colorTemp, isQualified] = temp;
          try {
            const [tempColors, created] = await TempColors.findOrCreate({
              where: { tc_temp: colorTemp, tc_qualified: isQualified },
              defaults: { tc_temp: colorTemp, tc_qualified: isQualified }, // Add this
            });
            if (created) {
              console.log(`Created TempColors - tc_temp: ${tempColors.colorTemp}`);
            }
          } catch (error) {
            console.error(`Error creating Temp and isQualified: ${colorTemp} - ${isQualified}\n`, error);
          }
        });

        // Insert Certifications into the database
        let certifications = extractCertificationsFromObject(item.certifications);
        certifications.forEach(async (certification) => {
          try {
            const [certificationRecord, created] = await Certifications.findOrCreate({
              where: { cert_label: certification },
            });
            if (created) {
              console.log(`Created Certification: ${Certifications.certification}`);
            }
          } catch (error) {
            console.error(`Error creating Certification: ${certification}\n`, error);
          }
        });

        // Insert gamme_temp_colors into the database
        temps.map(async (temp) => {
          let [colorTemp, isQualified] = temp;
          let productId = await getproductId(item);
          const temp_color = await TempColors.findOne({
            where: { tc_temp: colorTemp, tc_qualified: isQualified },
          });
          if (temp_color) {
            const [gamme_temp_colors, created] = await Gamme_temp_colors.findOrCreate({
              where: { product_id: productId, tc_id: temp_color.tc_id },
              defaults: { product_id: productId, tc_id: temp_color.tc_id },
            });
            if (created) {
              console.log(`Created gamme_temp_colors: ${gamme_temp_colors.product_id} - ${gamme_temp_colors.tc_id}`);
            } else {
              console.log(`gamme_temp_colors already exists:`);
            }
          }
        });

        // Insert PL certifications into the database
        certifications.map(async (certification) => {
          let productId = await getproductId(item);
          const plCert = await Certifications.findOne({
            where: { cert_label: certification },
          });
          if (plCert) {
            const [pl_certifications, created] = await PL_Certifications.findOrCreate({
              where: { product_id: productId, cert_id: plCert.cert_id },
              defaults: { product_id: productId, cert_id: plCert.cert_id },
            });
            if (created) {
              console.log(`Created PL_Certifications: ${pl_certifications.product_id} - ${pl_certifications.cert_id}`);
            } else {
              console.log(`PL_Certifications already exists:`);
            }
          }
        });

        console.log(`Created PL id: `);
      } catch (error) {
        console.error(`Error creating product`, error);
      }
    })();
  });
  await Promise.all(first).then(() => {
    console.log("All products created");
  });
  //compositeTable();
});
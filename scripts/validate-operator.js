import { readFile } from "node:fs/promises";
import { parse } from "yaml";

const file = "data/operator.yml";
const requiredFields = [
  "name",
  "address.street",
  "address.postal_code",
  "address.city",
  "address.country",
  "email.general",
  "email.privacy"
];

function valueAt(data, field) {
  return field.split(".").reduce((value, key) => value?.[key], data);
}

function fail(field, message) {
  throw new Error(`${file}: ${field}: ${message}`);
}

const operator = parse(await readFile(new URL("../data/operator.yml", import.meta.url), "utf8"));

for (const field of requiredFields) {
  const value = valueAt(operator, field);
  if (typeof value !== "string" || value.trim() === "") {
    fail(field, "Pflichtfeld fehlt oder ist leer");
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
for (const field of ["email.general", "email.privacy"]) {
  if (!emailPattern.test(valueAt(operator, field))) {
    fail(field, "ungültige E-Mail-Adresse");
  }
}

console.log(`${file}: Betreiber-Stammdaten sind gültig.`);


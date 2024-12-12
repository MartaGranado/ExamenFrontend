import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Desactiva la regla no-unused-vars
      "@typescript-eslint/no-unused-vars": "off", 

      // Puedes desactivar otras reglas aquí si es necesario
      "@typescript-eslint/no-explicit-any": "off", // Desactiva la regla para evitar el uso de `any`

      // Desactiva la regla no-img-element
      "@next/next/no-img-element": "off", // Si no quieres que te avise sobre el uso de <img> en lugar de <Image>
    },
  },
];

export default eslintConfig;

import { parse } from "csv-parse/browser/esm/sync";
import addMonths from "date-fns/addMonths";
import { setupView } from "./setupView";

type FieldsCSV = {
  "Data de Compra": string;
  "Nome no Cartão": string;
  "Final do Cartão": string;
  Categoria: string;
  Descrição: string;
  Parcela: string;
  "Valor (em US$)": string;
  "Cotação (em R$)": string;
  "Valor (em R$)": string;
};

type Debt = {
  "Data de Compra": Date;
  "Valor (em R$)": number;
  Parcela: [number, number];
};

(function () {
  const debtPerMonth: Array<Record<string, number>> = [];
  const debtPerMonthFromLocalStorage = localStorage.getItem("debtPerMonth");
  if (debtPerMonthFromLocalStorage) {
    setupView(JSON.parse(debtPerMonthFromLocalStorage));
  }
  const input = document.getElementById("input");
  if (!input) {
    throw new Error("Input element not found");
  }
  input.addEventListener("input", async (e) => {
    const target = e.target as HTMLInputElement;
    const [file] =  Array.from(target.files || []);
    if (!file) {
      target.value = "";
      return;
    }
    const text = await file.text();
    const debts = (
      parse(text, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ";",
      }) as FieldsCSV[]
    )
      .map(
        (record) =>
          ({
            "Data de Compra": new Date(
              record["Data de Compra"].split("/").reverse().join("-")
            ),
            "Valor (em R$)": +record["Valor (em R$)"]
              .replace(".", "")
              .replace(",", "."),
            Parcela:
              record.Parcela === "Única" ||
              record.Descrição.includes("Anuidade Diferenciada")
                ? false
                : record.Parcela.split("/").map(Number),
          } as Debt)
      )
      .filter((record) => record["Valor (em R$)"] > 0 && record.Parcela);
    debts.forEach((debt) => {
      let j = 1;
      for (let i = debt.Parcela[0]; i <= debt.Parcela[1]; i += 1) {
        const currentDate = addMonths(debt["Data de Compra"], i);
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const key = `${month}/${year}`;
        if (!debtPerMonth[j]) {
          debtPerMonth[j] = {};
        }
        if (!debtPerMonth[j][key]) {
          debtPerMonth[j][key] = 0;
        }
        debtPerMonth[j][key] += debt["Valor (em R$)"];
        j += 1;
      }
    });
    debtPerMonth.map((el) => {
      el["Total"] = Object.values(el).reduce((acc, value) => acc + value, 0);
    });
    debtPerMonth[0] = {
      Total: debtPerMonth
        .map((el) => el["Total"])
        .reduce((acc, value) => acc + value, 0),
    };
    target.value = "";
    setupView(debtPerMonth);
    localStorage.setItem("debtPerMonth", JSON.stringify(debtPerMonth));
    debtPerMonth.length = 0;
  });
})();

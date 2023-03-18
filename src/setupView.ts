const { format } = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const totalHtml = (currentMonthAmount: number, totalAmount: number) => `
<p class="text-lg text-center">
  Dívida deste mês R$ ${format(currentMonthAmount)}
</p>
<p class="text-lg text-center">
  Dívida dos próximos meses R$ ${format(totalAmount - currentMonthAmount)}
</p>
<p class="text-lg text-center">
  Dívida total R$ ${format(totalAmount)}
</p>
`;

const nextMonthsHtml = (items: Array<Record<string, number>>) => `
<p class="text-lg text-center">Próximos meses:</p>
<div class="flex justify-center flex-wrap">
${items
  .map(
    (item) => `
  <div class="border border-gray w-[232px] m-1.5">
    <header class="bg-darkGray border-b border-gray p-1 text-center">
      Valor total ${format(item["Total"])}
    </header>
    <div class="p-1 text-sm">
      <p>Detalhes:</p>
      <ul>
        ${Object.entries(item)
          .map(([key, value]) =>
            key !== "Total" ? `<li>${key}: R$ ${format(value)}</li>` : ""
          )
          .join("")}
      </ul>
    </div>
  </div>`
  )
  .join("")}
</div>
`;

const setupView = (debtPerMonth: Array<Record<string, number>>) => {
  const [everyMonth, currentMonth, ...nextMonths] = debtPerMonth;
  const totalEl = document.getElementById("total");
  const nextMonthsEl = document.getElementById("next-months");
  if (!totalEl || !nextMonthsEl) {
    throw new Error("Element not found");
  }
  totalEl.innerHTML = totalHtml(currentMonth["Total"], everyMonth["Total"]);
  nextMonthsEl.innerHTML = nextMonthsHtml(nextMonths);
};

export { setupView };

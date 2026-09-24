/**
 * Разметка Schema.org одним компонентом вместо восьми копий
 * `dangerouslySetInnerHTML` по страницам.
 *
 * JSON.stringify сам по себе для вставки в <script> небезопасен: строка
 * `</script>` внутри любого поля закрывает тег раньше времени, и остаток
 * данных попадает в документ как разметка. Сейчас все данные наши и
 * статические, но названия тканей и описания правит заказчик, а цена
 * приходит из внешнего курса ЦБ - поэтому экранируем на входе, а не
 * надеемся на содержимое.
 */

/*
 * U+2028 и U+2029 - разделители строк. В JSON они допустимы, а в теле
 * скрипта рвут строку пополам. Регулярные выражения для них собираются из
 * кодов: держать сами символы в исходнике нельзя, они ломают уже этот файл.
 */
const LINE_SEPARATORS = [
  [new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028"],
  [new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029"],
] as const;

function serialize(data: unknown) {
  let json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  for (const [pattern, replacement] of LINE_SEPARATORS) {
    json = json.replace(pattern, replacement);
  }

  return json;
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

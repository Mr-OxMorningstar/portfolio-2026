import { savings } from '../data/profile';

export default function Savings() {
  return (
    <article>
      <h3 className="text-2xl font-semibold tracking-tight">{savings.title}</h3>
      <p className="mt-3 max-w-2xl">{savings.summary}</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-[15px]">
          <caption className="sr-only">Monthly AWS savings by account, in US dollars</caption>
          <thead>
            <tr className="border-b border-ink text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">What changed</th>
              <th scope="col" className="py-2 pr-4 font-medium">How it is known</th>
              <th scope="col" className="py-2 text-right font-medium">US$ / month</th>
            </tr>
          </thead>
          <tbody>
            {savings.ledger.map((row) => (
              <tr key={row.work} className="border-b border-rule align-top">
                <td className="py-3 pr-4">
                  <span className="font-medium">{row.account}.</span> {row.work}
                </td>
                <td className="py-3 pr-4 text-sm text-muted">{row.evidence}</td>
                <td className="py-3 text-right font-mono text-sm whitespace-nowrap">{row.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink">
              <th scope="row" colSpan={2} className="py-3 pr-4 font-semibold">
                Total
              </th>
              <td className="py-3 text-right font-mono text-sm font-semibold whitespace-nowrap">{savings.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h4 className="mt-10 font-semibold">How I went about it</h4>
      <div className="mt-3 max-w-2xl space-y-4">
        {savings.method.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

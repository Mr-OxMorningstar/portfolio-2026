import { useEffect, useRef, useState } from 'react';
import { savings } from '../data/profile';
import { roomVars } from '../data/rooms';
import { useTween } from './useTween';

type Basis = 'measured' | 'all';

// Every amount is a number or a range such as '561.00–591.00'; the low end is what the bars and subtotals lean on.
const bounds = (amount: string) => {
  const [low, high = low] = amount.split('–').map((part) => Number(part.replace(/,/g, '')));
  return { low, high };
};

const rows = savings.ledger.map((row) => ({ ...row, ...bounds(row.amount) }));
const widest = Math.max(...rows.map((row) => row.low));

const subtotal = (basis: Basis) => {
  const counted = rows.filter((row) => basis === 'all' || row.measured);
  return { low: counted.reduce((sum, row) => sum + row.low, 0), high: counted.reduce((sum, row) => sum + row.high, 0) };
};

const money = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const range = (low: number, high: number) => (low === high ? money(low) : `${money(low)}–${money(high)}`);

const { controls } = savings;
const BASES: Basis[] = ['measured', 'all'];

export default function Savings() {
  const [basis, setBasis] = useState<Basis>('all');
  const [seen, setSeen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = tableRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setSeen(true), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const total = subtotal(basis);
  const low = useTween(total.low, seen);
  const high = useTween(total.high, seen);

  return (
    <article style={roomVars('devops')}>
      <h3 className="border-l-4 border-(--room) pl-3 text-2xl font-semibold tracking-tight">{savings.title}</h3>
      <p className="mt-3 max-w-2xl">{savings.summary}</p>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div role="group" aria-label={controls.group} className="inline-flex border border-ink">
          {BASES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={basis === option}
              onClick={() => setBasis(option)}
              className="cursor-pointer px-3.5 py-2 text-sm font-medium transition-colors aria-pressed:bg-ink aria-pressed:text-paper hover:bg-rule aria-pressed:hover:bg-ink"
            >
              {controls[option]}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">{controls.hint}</p>
      </div>

      <div ref={tableRef} className="relative mt-4 overflow-x-auto">
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
            {rows.map((row) => {
              const dimmed = basis === 'measured' && !row.measured;
              return (
                <tr
                  key={row.work}
                  className="group border-b border-rule align-top transition-colors hover:bg-(--room)/10"
                >
                  <td className="py-3 pr-4">
                    <span className="font-medium">{row.account}.</span> {row.work}
                    <span aria-hidden className={`mt-2 block h-2 bg-rule transition-opacity ${dimmed ? 'opacity-40' : ''}`}>
                      <span
                        className="block h-full origin-left bg-(--room) transition-[transform,background-color] duration-700 group-hover:bg-(--room-deep) motion-reduce:transition-none"
                        style={{ width: `${(row.low / widest) * 100}%`, transform: `scaleX(${seen ? 1 : 0})` }}
                      />
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-muted">{row.evidence}</td>
                  <td className="py-3 text-right font-mono text-sm whitespace-nowrap">
                    <span className={dimmed ? 'line-through' : ''}>{row.amount}</span>
                    {dimmed && (
                      <span className="mt-1 block font-sans text-sm font-medium text-(--room-deep)">{controls.notCounted}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink">
              <th scope="row" colSpan={2} className="py-3 pr-4 font-semibold">
                {basis === 'all' ? controls.totalAll : controls.totalMeasured}
              </th>
              <td className="py-3 text-right font-mono text-sm font-semibold whitespace-nowrap">
                <span aria-hidden>{range(low, high)}</span>
                <span className="sr-only" aria-live="polite">{range(total.low, total.high)}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-2 text-sm text-muted">{controls.bars}</p>

      <h4 className="mt-10 font-semibold text-(--room-deep)">How I went about it</h4>
      <div className="mt-3 max-w-2xl space-y-4">
        {savings.method.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

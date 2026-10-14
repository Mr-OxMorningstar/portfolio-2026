import { type FormEvent, useEffect, useRef, useState } from 'react';
import { advice as copy } from '../data/profile';
import RoomStrip from './RoomStrip';

const MAX_LENGTH = 280;

// Asks the visitor for one piece of advice. Nothing leaves the page: the text is only shown back to them.
export default function Advice() {
  const [text, setText] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const stop = useRef<() => void>(null);
  const run = useRef(0); // bumped whenever a show should no longer start: a new submit, a reset, or leaving the page
  const field = useRef<HTMLTextAreaElement>(null);
  const thanks = useRef<HTMLDivElement>(null);
  const moveFocus = useRef<'thanks' | 'field' | null>(null);

  useEffect(
    () => () => {
      run.current++;
      stop.current?.();
    },
    [],
  );

  // Once the new view is on screen, hand keyboard and screen reader users to it.
  useEffect(() => {
    if (moveFocus.current === 'thanks') thanks.current?.focus();
    if (moveFocus.current === 'field') field.current?.focus();
    moveFocus.current = null;
  }, [sent]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError(true);
      field.current?.focus();
      return;
    }
    setError(false);
    moveFocus.current = 'thanks';
    setSent(trimmed);

    const mine = ++run.current;
    stop.current?.();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const button = (event.nativeEvent as SubmitEvent).submitter?.getBoundingClientRect();
    const origin = button ? { x: button.left + button.width / 2, y: button.top + button.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
    // Three.js loads only now, and the show tidies itself away after about four seconds. If it cannot start, the thank-you is all there is.
    import('../three/adviceCelebration')
      .then(({ playCelebration }) => {
        if (run.current !== mine) return;
        stop.current = playCelebration({ advice: trimmed, origin });
      })
      .catch(() => {});
  };

  const reset = () => {
    run.current++;
    stop.current?.();
    moveFocus.current = 'field';
    setText('');
    setSent(null);
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-2xl font-semibold tracking-tight">{copy.heading}</h3>
      {sent !== null ? (
        <div ref={thanks} role="status" tabIndex={-1} className="mt-3 outline-offset-8">
          <p>{copy.thanks}</p>
          <blockquote className="mt-4 border-l-4 border-(--room) bg-white/60 px-5 py-4 text-lg break-words whitespace-pre-wrap">{sent}</blockquote>
          <RoomStrip className="mt-4 w-40" />
          <button
            type="button"
            onClick={reset}
            className="mt-6 cursor-pointer border border-rule px-4 py-2.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
          >
            {copy.again}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-3">
          <p>{copy.prompt}</p>
          <label htmlFor="advice-text" className="mt-5 block text-sm font-medium text-(--room-deep)">
            {copy.label}
          </label>
          <textarea
            id="advice-text"
            ref={field}
            required
            rows={3}
            maxLength={MAX_LENGTH}
            value={text}
            placeholder={copy.placeholder}
            aria-invalid={error}
            aria-describedby="advice-note"
            onChange={(e) => {
              setText(e.target.value);
              setError(false);
            }}
            className="mt-1 block w-full resize-y border border-ink bg-white/70 px-3 py-2 text-[17px] aria-[invalid=true]:border-[#c42125]"
          />
          <div id="advice-note" className="mt-1 flex flex-wrap justify-between gap-x-4 text-sm text-muted">
            <span role={error ? 'alert' : undefined}>
              {error ? <span className="font-medium text-[#c42125]">{copy.empty}</span> : copy.privacy}
            </span>
            <span>
              {text.length} / {MAX_LENGTH}
            </span>
          </div>
          <button
            type="submit"
            className="mt-5 inline-block cursor-pointer bg-ink px-5 py-2.5 font-medium text-paper transition-colors hover:bg-(--room-deep)"
          >
            {copy.submit}
          </button>
        </form>
      )}
    </div>
  );
}

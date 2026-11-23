import { useState } from 'react';
import { SduiParser } from '@slashand/sdui-blade-core';
import type { SduiBladeNode, SduiNode } from '@slashand/sdui-blade-core';
import {
  BaseBlade,
  BladeHeader,
  BladeContent,
  BladeFooter,
  SduiRenderer,
  bladeStoreInstance,
} from '@slashand/sdui-blade-react';
import type { BladeFooterAlignment } from '@slashand/sdui-blade-react';
import { createJourneyBlade, createSizingBlade, isExampleSize, sizingExamples } from './BladeExamples';
import type { ExampleSize } from './BladeExamples';
import './BladeExamples.css';

interface ExampleProps {
  node: SduiBladeNode;
}
const close = (id: string) => bladeStoreInstance.getState().closeBlade(id);
const open = (node: SduiNode) =>
  bladeStoreInstance.getState().openBlade(SduiParser.parseManifest({ version: '1.0', blade: node }).blade);
const exampleSize = (node: SduiBladeNode): ExampleSize =>
  isExampleSize(node.properties.width) ? node.properties.width : 'full';

function SizingBlade({ node }: ExampleProps) {
  const [name, setName] = useState('');
  const size = exampleSize(node);
  const { description, next } = sizingExamples[size];
  return (
    <BaseBlade size={size} data-sdui-id={node.id}>
      <BladeHeader title={node.properties.title} onClose={() => close(node.id)} />
      <BladeContent>
        <p>{description}</p>
        <label className="sdui-example-field">
          Configuration name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Retained when a child opens"
          />
        </label>
        {next && (
          <button type="button" className="sdui-example-button" onClick={() => open(createSizingBlade(next))}>
            Open {sizingExamples[next].name}
          </button>
        )}
        {size === 'menu' && (
          <button type="button" className="sdui-example-button" onClick={() => close(node.id)}>
            Return to parent
          </button>
        )}
      </BladeContent>
      <BladeFooter>
        <button type="button" className="sdui-example-button" onClick={() => close(node.id)}>
          Done
        </button>
      </BladeFooter>
    </BaseBlade>
  );
}

function KitchenSinkBlade({ node }: ExampleProps) {
  const [status, setStatus] = useState('');
  return (
    <BaseBlade size={exampleSize(node)} data-sdui-id={node.id}>
      <BladeHeader title={node.properties.title} onClose={() => close(node.id)} />
      <BladeContent className="sdui-example-kitchen-content">
        <p>Scroll this content. The header and footer remain fixed in the work area.</p>
        <p role="status">{status}</p>
        {Array.from({ length: 20 }, (_, index) => (
          <div className="sdui-example-scroll-block" key={index}>
            Scroll block {index + 1}
          </div>
        ))}
      </BladeContent>
      <BladeFooter align="between" className="sdui-example-footer">
        <button type="button" className="sdui-example-button" onClick={() => close(node.id)}>
          Cancel
        </button>
        <button
          type="button"
          className="sdui-example-button"
          onClick={() => setStatus('Demo configuration saved for this open blade.')}
        >
          Save configuration
        </button>
      </BladeFooter>
    </BaseBlade>
  );
}

function LimitedScrollBlade({ node }: ExampleProps) {
  return (
    <BaseBlade size={exampleSize(node)} data-sdui-id={node.id}>
      <BladeHeader title={node.properties.title} onClose={() => close(node.id)} />
      <BladeContent>
        <p>The list scrolls independently of the blade content.</p>
        <section className="sdui-example-limited-box" aria-label="Independent list">
          <h3>Internal scroll viewport</h3>
          <div className="sdui-example-limited-list" tabIndex={0} role="region" aria-label="Scrollable entries">
            {Array.from({ length: 30 }, (_, index) => (
              <p key={index}>List item entry {index + 1}</p>
            ))}
          </div>
        </section>
        <p>The surrounding content and bottom action remain in place.</p>
      </BladeContent>
      <BladeFooter>
        <button type="button" className="sdui-example-button" onClick={() => close(node.id)}>
          Acknowledge
        </button>
      </BladeFooter>
    </BaseBlade>
  );
}

function JourneyBlade({ node }: ExampleProps) {
  const props = node.properties as Record<string, unknown>;
  const depth =
    typeof props.depth === 'number' && Number.isSafeInteger(props.depth) && props.depth > 0 ? props.depth : 1;
  const [note, setNote] = useState('');
  return (
    <BaseBlade size={exampleSize(node)} data-sdui-id={node.id}>
      <BladeHeader title={`Journey level ${depth}`} onClose={() => close(node.id)} />
      <BladeContent>
        <p>Open a child to shift this level back by 60px. Back and Forward restore the actual host stack.</p>
        <label className="sdui-example-field">
          Level note
          <input value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        {(['large', 'medium', 'small', 'menu'] as const).map((size) => (
          <button
            type="button"
            key={size}
            className="sdui-example-button"
            onClick={() => open(createJourneyBlade(depth + 1, size))}
          >
            Stack {sizingExamples[size].name}
          </button>
        ))}
      </BladeContent>
      <BladeFooter align="between" className="sdui-example-footer">
        <button
          type="button"
          className="sdui-example-button"
          onClick={() => bladeStoreInstance.getState().closeAllBlades()}
        >
          Collapse all
        </button>
        <button type="button" className="sdui-example-button" onClick={() => close(node.id)}>
          Close level {depth}
        </button>
      </BladeFooter>
    </BaseBlade>
  );
}

function NakedBlade({ node }: ExampleProps) {
  return (
    <article className="sdui-example-naked" data-sdui-id={node.id}>
      <h2>Naked Decoupling</h2>
      <p>
        This custom view uses no BaseBlade, BladeHeader or BladeFooter. The real host still provides its work-area
        boundary, animation and history.
      </p>
      <button type="button" className="sdui-blade-close sdui-example-button" onClick={() => close(node.id)}>
        Conclude demonstration
      </button>
    </article>
  );
}

function FooterAlignmentsBlade({ node }: ExampleProps) {
  const [alignment, setAlignment] = useState<BladeFooterAlignment>('right');
  const [committed, setCommitted] = useState('');
  return (
    <BaseBlade size={exampleSize(node)} data-sdui-id={node.id}>
      <BladeHeader title={node.properties.title} onClose={() => close(node.id)} />
      <BladeContent>
        <p>Choose an alignment to move the actual SDK footer actions.</p>
        <div className="sdui-example-alignment-grid">
          {(['left', 'center', 'right', 'between'] as const).map((value) => (
            <button
              type="button"
              className="sdui-example-button"
              key={value}
              aria-pressed={alignment === value}
              onClick={() => {
                setAlignment(value);
                setCommitted('');
              }}
            >
              Align {value}
            </button>
          ))}
        </div>
        <p role="status">{committed}</p>
      </BladeContent>
      <BladeFooter align={alignment} className="sdui-example-footer">
        {alignment === 'between' && (
          <button type="button" className="sdui-example-button" onClick={() => close(node.id)}>
            Dismiss
          </button>
        )}
        <button
          type="button"
          className="sdui-example-button"
          onClick={() => setCommitted(`Applied ${alignment} alignment to this demo.`)}
        >
          Commit changes
        </button>
      </BladeFooter>
    </BaseBlade>
  );
}

/** Custom example roots share the standard Blade node and the same parser/host as the gallery. */
export function ExampleBlade({ node }: ExampleProps) {
  switch ((node.properties as Record<string, unknown>).exampleKind) {
    case 'sizing':
      return <SizingBlade node={node} />;
    case 'kitchen':
      return <KitchenSinkBlade node={node} />;
    case 'limited':
      return <LimitedScrollBlade node={node} />;
    case 'journey':
      return <JourneyBlade node={node} />;
    case 'naked':
      return <NakedBlade node={node} />;
    case 'footer':
      return <FooterAlignmentsBlade node={node} />;
    default:
      return <SduiRenderer node={node} />;
  }
}

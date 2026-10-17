import type { Question } from '../content/types';
import { Choice, TapAll } from './Choice';
import { Label, TapOrder } from './Diagram';
import { DragTo, Order, Sort } from './DragSort';
import { SceneTap } from './SceneTap';
import type { Feedback } from './types';

export function Activity({ q, fb }: { q: Question; fb: Feedback }) {
  switch (q.type) {
    case 'choice': return <Choice q={q} fb={fb} />;
    case 'tapAll': return <TapAll q={q} fb={fb} />;
    case 'sceneTap': return <SceneTap q={q} fb={fb} />;
    case 'label': return <Label q={q} fb={fb} />;
    case 'dragTo': return <DragTo q={q} fb={fb} />;
    case 'sort': return <Sort q={q} fb={fb} />;
    case 'order': return <Order q={q} fb={fb} />;
    case 'tapOrder': return <TapOrder q={q} fb={fb} />;
  }
}

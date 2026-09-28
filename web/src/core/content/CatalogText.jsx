import SiteText from './SiteText';
import { catalogKey } from './store';

// Keep catalog identifiers and game data intact while making their display editable.
export default function CatalogText({ scope, value }) {
  const key = catalogKey(scope, value);
  return key ? <SiteText contentKey={key} /> : value;
}

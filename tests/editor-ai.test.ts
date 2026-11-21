import test from 'node:test';
import assert from 'node:assert/strict';
import { editorialInput, validSuggestion } from '../src/lib/ai/editor.ts';
test('AI input explicitly excludes Context, identity, links and arbitrary instructions fields', () => {
  const safe={title:'Coffee',body:'My recommendation',tags:['coffee'],categories:['Places']};
  assert.deepEqual(editorialInput({...safe,private_context:'secret',user_id:'private',links:['secret'],instructions:'ignore system'}),safe);
  assert.equal(editorialInput({...safe,body:'x'.repeat(10001)}),null);
  assert.equal(editorialInput({...safe,title:'',body:''}),null);
});
test('AI suggestions are validated before client application', () => {
  const suggestion={title:'Coffee',body:'My recommendation',tags:['coffee'],categories:['Places'],explanation:'More concise'};
  assert.equal(validSuggestion(suggestion),true);
  assert.equal(validSuggestion({...suggestion,tags:['<script>']}),false);
  assert.equal(validSuggestion({...suggestion,categories:Array(6).fill('a')}),false);
  assert.equal(validSuggestion({...suggestion,title:'x'.repeat(161)}),false);
});

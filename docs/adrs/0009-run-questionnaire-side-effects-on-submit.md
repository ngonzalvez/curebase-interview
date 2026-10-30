# 0009. Run questionnaire side effects on submit

- Status: Accepted
- Date: 2026-10-30
- Related: [0005](0005-api-architecture.md), [0007](0007-store-questionnaires-as-json-documents.md), [0008](0008-store-participants-with-a-generated-bmi.md)

## Context

Some questionnaires need code to run after a response is submitted, such as copying height and weight from the answers to the participant's profile. Other questionnaires need none. All questionnaires are submitted through the same endpoint.

We need to decide how a questionnaire triggers code on submit without the submit endpoint knowing about specific questionnaires.

## Options considered

- **Code in the submit endpoint, by questionnaire.** Simple at first, but the endpoint grows an `if` for every questionnaire.
- **Every side effect runs on every response and skips itself when data is missing.** No configuration, but a questionnaire cannot opt out, and a failure blocks unrelated questionnaires.
- **Side effects declared in the questionnaire definition, implemented in a code registry.** Each questionnaire lists the side effects it needs and maps their inputs to its questions. New side effects need a code change.
- **Uploaded scripts stored with the questionnaire.** Fully dynamic, but runs untrusted code against health data.
- **Background jobs.** Keeps submit fast, but the response and its side effects are not saved together.

## Decision

We will declare side effects in the questionnaire definition and implement them in a registry in `apps/api`:

```json
"sideEffects": [
  { "key": "update_participant_profile", "inputs": { "heightCm": "height", "weightKg": "weight" } }
]
```

- The registry maps each key to a label, its inputs (each with a label and type) and the function to run. The definition only references keys.
- `inputs` maps each input the side effect needs to a question key.
- When a definition is saved, the API checks that each key exists and that each input points to a question of the right type.
- On submit, the API saves the response and runs the side effects in order, in the same transaction. If one fails, nothing is saved.

We chose it because:

- The submit endpoint stays the same for every questionnaire.
- Each questionnaire runs only the side effects it declares.
- Only reviewed code runs, and the response and its side effects are saved together or not at all.

## Consequences

- Adding a side effect requires a code change and a deploy.
- A failing side effect blocks the submission.

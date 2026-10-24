# Single admin workspace

Keep one admin at /admin/index.html. Do not recreate retired agency panels.
For every new public Client Demo Room feature, implement its corresponding admin control in the same change, or clearly report it as unavailable. Do not add controls that only change localStorage while claiming all visitors see the result.
Keep the public renderer, API validation, save logic, and form fields aligned. Preserve project IDs and existing invitation records when editing unrelated fields. Never commit admin credentials, GitHub tokens, session secrets, or plaintext invitation codes. All privileged writes must use server authentication and same-origin checks. Never silently overwrite concurrent GitHub changes.
Do not modify client project admin demos as part of agency admin work.

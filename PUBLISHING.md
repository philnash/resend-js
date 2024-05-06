# Publishing the module

To publish the module ensure that `src/version.ts` is updated to the latest.

Tag the main branch with the version number in the format "vX.Y.Z" and push the tag to GitHub. The GitHub workflow `publish.yml` will handle publishing to npm here: https://www.npmjs.com/package/@philnash/resend.

A webhook will handle publishing to deno.land/x here https://deno.land/x/resend_js.
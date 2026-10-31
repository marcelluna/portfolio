#!/bin/bash
# Builds the production bundle. The deployable artifacts are the CONTENTS of
# dist/browser/ — upload those to your Hostinger web root (public_html).
# See DEPLOY.md for the full steps.
set -e
ng build --configuration production
echo
echo "Build complete. Upload the CONTENTS of dist/browser/ to public_html:"
ls -A dist/browser/

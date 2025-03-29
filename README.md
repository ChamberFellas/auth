

Add dockerhub credentials to github secrets as
DOCKERHUB_USERNAME
DOCKERHUB_PASSKEY

Add dockerhub repositories needed for integration tests in .github/workflows/int-test-stage.yml

To generate Kubernetes deployment files for a microservice, run:
python3 scripts/gen_kube.py <service_name>

Ensure the <service_name> mathches the github repo name as this is used within the github actions to deploy to dockerhub


to run the file you will need a .env file witht the following details:
ACCESS_TOKEN_SECRET=nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn(hex)
REFRESH_TOKEN_SECRET=nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn(hex)
MY_IP_ADDRESS=nnn.nn.nnn.nn

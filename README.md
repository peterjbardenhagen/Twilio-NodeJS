# Twilio NodeJS Demo

Node JS application to demonstrate the use of Twilio platform

Instructions:
1. Add or edit .env file in the root directory (.env has been added to .gitignore to ensure that when you push changes to GitHub it will not expose your private tokens and keys)
2. Register an account at http://api.openweathermap.org and add WEATHER_AUTH_TOKEN to .env
3. Register an account at https://www.twilio.com and add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env
4. Create a virtual number in the Twilio console from any country that you prefer and add this to FROM_MOBILE in .env

.env template:

TWILIO_AUTH_TOKEN = "xyz"
TWILIO_ACCOUNT_SID = "xyz"
WEATHER_AUTH_TOKEN = "xyz"
FROM_MOBILE = "xyz"

API Keys:
For security reasons the API tokens and keys have been excluded from the GIT repo. If you did attempt to upload this private information, GitHub will advise you of the security issue, and your API keys will still appear in the file history publicly which is not best practice and poses major security risks for your organisation

1. A typical approach is to use a CI/CD tool with restricted access to deploy the configuration changes (e.g. Octopus Deploy, Bamboo, TFS) to set the tokens upon deployment to a secure environment
2. .env file has gitignore in this repo to avoid uploading to GitHub

Alternative ways to secure API keys in public repos:

1. GIT encrypt may also be appropriate in some cases to encrypt the entire repo: https://www.freecodecamp.org/news/how-to-securely-store-api-keys-4ff3ea19ebda/
2. Use git-secret to securely store encrypted configuration files in the repo that can be decrypyed using a secret key https://git-secret.io/


* For simplicity in this exercise, we will use the git ignored .env file to avoid exposing API keys


How to Run:
1. If you are using VS Code, go to Terminal
2. npm run start
3. Follow the instructions in the console - repeat if you would like to
4. View latest delivery status at http://149.28.176.193:8080

Troubleshooting:
On first try if there is any errors in Terminal or command prompt:
rm node_modules
npm install
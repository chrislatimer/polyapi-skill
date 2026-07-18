Source: https://docs.polyapi.io/quickstart.html

# Quickstart

## Get Your API Key

To get an API key: [sign up for a PolyAPI account](https://na1.polyapi.io/canopy/polyui/signup).

Complete the form to create a new tenant on the PolyAPI cloud instance and service tier of your choice.

Tip

Try free with no obligations by selecting the [Trial Tier](https://polyapi.io/proof-of-value-tier-limits) during sign up.

Once you’ve finished sign up and confirmed your verification code: your tenant will be setup in the PolyAPI cloud and you’ll be given your API key. Copy this key and save it somewhere secure as you will not be able to get this key again.

And with that you’re now ready to start using the PolyAPI and services!

## Install the Visual Studio Code Extension

You can use PolyAPI right from your favorite code editor!

Tip

Alternatively, you can use the public beta of our PolyAPI GitHub Copilot Extension with GitHub Copilot.

Please refer to [GitHub Copilot Extension](copilot/index.html) for more information.

Helpful Resources

[Beginners guide to Visual Studio Code](https://code.visualstudio.com/docs/getstarted/getting-started)

[Setting up Poly (video)](https://www.youtube.com/watch?v=QQfi4hURHTo)

1. Open Visual Studio Code
2. Open the Extensions pane from the sidebar.
3. Search for “Poly Assistant” extension.
4. Click on “Install”.

Once the extension is installed you should see the Parrot icon in your primary sidebar which opens the Poly AI chat panel.

[![View of VS Code sidebar highlighting the Poly Parrot and Palm Tree icons.](_images/vscode-extension-icons.png)](_images/vscode-extension-icons.png)

If you opened an existing Poly project in VSCode the extension would automatically grab the project configuration to determine the project language type and authentication information needed to run the extension.

But since this is our first time the extension doesn’t yet know that information.

Open the Poly AI panel and click the “Setup Poly client” button to finish setting up the PolyAPI client SDK. The extension will guide you through the process of selecting the project type of your project (the programming language you’re using) and setting up your API key.

Warning

The VSCode Extension only supports a single language per VSCode workspace. To use multiple languages with PolyAPI keep each language in it’s own folder and open each in their own instance of VSCode where the extension can be configured separately for each language.

## Asking Questions

Once the extension is setup fully you should see the Palm Tree icon in your primary sidebar which will allow you to explore dozens of APIs provided out-of-the-box by PolyAPI as well as any APIs and functions you create.

In addition to exploring the SDK you can chat with the Poly Assistant which has full access to the same generated SDK.

Click the Parrot icon to open the AI chat panel, and click where is says “Ask Poly about APIs and Events” to get chatting.

You can ask Poly about anything related to PolyAPI, and have it write code using your generated SDK. For example, you can ask:

- “How do I create a new contact on Hubspot?”
- “How do I search for a customer on Stripe?”

Feel free to ask about whatever API you’re interested in!

If you run into any issues or feel that Poly is unclear, please email [support@polyapi.io](mailto:support%40polyapi.io).

## Onward

The next step on the guided tour of Poly is to train your first [API Function](api_functions/index.html) and use it in your code!

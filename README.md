# Extension Installation Guide

Follow these three steps to get the extension running.

## 1. Install the Policy

First, you need to install a policy file in order to enable installing extensions from this repo.

### For Windows:

1. Download [chrome-policy.reg](./policy/chrome-policy.reg), or [edge-policy.reg](./policy/edge-policy.reg), then double-click it.
2. Approve the prompts from User Account Control and the Registry Editor.

### For macOS:

1. Download [chrome-policy.json](./policy/chrome-policy.json).
2. Copy it to `/Library/Application Support/Google/Chrome/Managed Policies/`.

### For Linux:

1. Download [chrome-policy.json](chrome-policy.json).
2. Copy it to `/etc/opt/chrome/policies/managed/`.

## 2. Restart Chrome

For the policy to take effect, completely quit and restart your browser.

## 3. Install the Extension

With the policy installed and your browser restarted, click here: [Install Extension](https://trmdi.github.io/mindfulness-bell/extension.crx).

---

You're all set!

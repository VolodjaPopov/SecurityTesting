# SecurityTesting

2026-08-12:

This repo consists of playwright tests for the 'bWAPP' application, an app designed to be full of security exploits.

The purpose of this repo is to explore how practical automation testing is for these types of tests, and will consist of tests testing various features of 'bWAPP' where automation is possible

If wou want to pull this repo and run the tests yourself you will need to run 'bWAPP' through a virtual machine (bee-box) and go directly to its IP (stored in .env, but may vary with time). If the virtual machine is not running at the time of testing it will be impossible to reach the app.

For now the primary focus of the tests is to automate sections which require no external tools (Burp suite...) but instead can be done all within the app. More updates as time goes on

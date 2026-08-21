# bWAPP Playwright SecurityTesting

2026-08-12:

This repo consists of playwright tests for the 'bWAPP' application, an app designed to be full of security exploits.

The purpose of this repo is to explore how practical automation testing is for these types of tests, and will consist of tests testing various features of 'bWAPP' where automation is possible

If wou want to pull this repo and run the tests yourself you will need to run 'bWAPP' through a virtual machine (bee-box) and go directly to its IP (stored in .env, but may vary with time). If the virtual machine is not running at the time of testing it will be impossible to reach the app.

For now the primary focus of the tests is to automate sections which require no external tools (Burp suite...) but instead can be done all within the app. More updates as time goes on

2026-08-21 Update:

Many tests for low security SQL and HTML injections have been written. For now, the tests only print out a message according to whether the field is vulnerable to injections, is not, or returns a different type of error (usually a SQL formatting error, worth investigating). The next stage will be to convert the tests to function as actual playwright tests, using expect, an simulate something that could be used in a regression pipeline.

So far, all the tests have been done using only Playwright, with no external tools (intercepting request can also be done only using Playwright), while this approach may not be the most effective, it can provide a solid basic foundation that can be ran during regression, and if any major Injection errors occur during a deploy, the regression will catch it.

Next step will be polishing already written tests to be more effective, plus writing new ones where possible.

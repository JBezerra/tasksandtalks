import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementFinder, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

defineSupportCode(function ({ Given, When, Then }) {
    Given(/^Eu estou na seção "([^\"]*)"$/, async (pageName) => {
        await browser.get("http://localhost:4200/thread");
        const sectionTitle = element(by.id('section-title'));
        await expect(sectionTitle.getText()).to.eventually.equal(pageName);
    });

    Given(/^Eu posso ver um email com o assunto "([^\"]*)"$/, async (emailSubject) => {
        const emails: ElementArrayFinder = element.all(by.id('email-subject'));
        await emails;

        const emailSelected = emails.filter((email) => {
            return email.getText().then(subject => subject === emailSubject);
        })
        await emailSelected;

        await emailSelected.then(subject => expect(Promise.resolve(subject.length)).to.eventually.equal(1));
    });

    When(/^Eu respondo o email com o assunto "([^\"]*)"$/, async (emailSubject) => {
        const emails: ElementArrayFinder = element.all(by.id('email-container'));
        await emails;

        await emails.map(async (emailElements) => {
            const subject: ElementFinder = emailElements.element(by.id('email-subject'));
            await subject;

            const subjectValue = await subject.getText();
            if (subjectValue === emailSubject) {
                await emailElements.element(by.id('reply-button')).click();
            }
        });
    });
})

import { Fragment, useState, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from "react-router-dom";
import HomePageNavBar from "../Components/HomePageNavBar";

export default function ImprintPage() {
  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

    function filterData() {
    var input = document.getElementById("myInput").value.toUpperCase();
    var dataContainer = document.getElementById("myData");
    var dataItems = dataContainer.getElementsByTagName("div");
    for (var i = 0; i < dataItems.length; i++) {
        var dataItem = dataItems[i];
        var dataItemText = dataItem.textContent.toUpperCase();
        if (dataItemText.indexOf(input) > -1) {
        dataItem.style.display = "";
        } else {
        dataItem.style.display = "none";
        }
    }
    }

  return (
    <section className="bg-white body-font relative">
    <HomePageNavBar />

    <div class="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
            <p class="font-sans font-semibold text-black  mb-1 text-3xl title-font">Data protection</p>

            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">1. Privacy at a glance</p><br/>

            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            General information
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The following notes provide a simple overview of what happens to your personal data when you visit our website. Personal data is all data with which you can be personally identified. Detailed information on the subject of data protection can be found in our data protection declaration listed under this text.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Data collection on our website
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Who is responsible for data collection on this website?
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The data processing on this website is carried out by the website operator. You can find their contact details in the imprint of this website.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            How do we collect your data?
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            On the one hand, your data is collected when you communicate it to us. This can, for example, be data that you enter in a contact form.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Other data is automatically recorded by our IT systems when you visit the website. This is primarily technical data (e.g. internet browser, operating system or time of the page call). This data is collected automatically as soon as you enter our website.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            What do we use your data for?
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Part of the data is collected to ensure that the website is provided without errors. Other data can be used to analyze your user behavior.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            What rights do you have regarding your data?
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You have the right to receive information about the origin, recipient and purpose of your stored personal data free of charge at any time. You also have the right to request the correction, blocking or deletion of this data. You can contact us at any time at the address given in the imprint if you have any further questions on the subject of data protection. You also have the right to lodge a complaint with the competent supervisory authority.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You also have the right, under certain circumstances, to request that the processing of your personal data be restricted. Details can be found in the data protection declaration under "Right to restriction of processing".
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Analysis tools and third-party tools
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            When you visit our website, your surfing behavior can be statistically evaluated. This is mainly done with cookies and so-called analysis programs. The analysis of your surfing behavior is usually anonymous; surfing behavior cannot be traced back to you. You can object to this analysis or prevent it by not using certain tools. You will find detailed information on this in the following data protection declaration.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can object to this analysis. We will inform you about the possibilities of objection in this data protection declaration.
            </p><br/>


            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">2. General information and mandatory information</p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
                Data protection
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this data protection declaration.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If you use this website, various personal data will be collected. Personal data is data with which you can be personally identified. This data protection declaration explains what data we collect and what we use it for. It also explains how and for what purpose this happens.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We would like to point out that data transmission on the Internet (e.g. when communicating by e-mail) can have security gaps. A complete protection of the data against access by third parties is not possible.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Note on the responsible body
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The responsible body for data processing on this website is:
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Rising Eagle GmbH
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Altensteinstrasse 40
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            14195 Berlin
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Telephone: 01789614244 or 015735587123
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Email: info@rising-eagle.de
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The responsible body is the natural or legal person who alone or together with others decides on the purposes and means of processing personal data (e.g. names, e-mail addresses, etc.).
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Revocation of your consent to data processing
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Many data processing operations are only possible with your express consent. You can revoke consent that you have already given at any time. An informal message by e-mail to us is sufficient. The legality of the data processing that took place up until the revocation remains unaffected by the revocation.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Right to object to data collection in special cases and to direct advertising (Art. 21 GDPR)
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If the data is processed on the basis of Article 6 Paragraph 1 Letter e or f GDPR, you have the right at any time to object to the processing of your personal data for reasons that arise from your particular situation; this also applies to profiling based on these provisions. The respective legal basis on which processing is based can be found in this data protection declaration. If you object, we will no longer process your affected personal data unless we can demonstrate compelling legitimate grounds for processing that outweigh your interests, rights and freedoms or the processing serves to assert, exercise or defend legal claims ( Objection according to Art. 21 Para. 1 GDPR).
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            If your personal data is processed in order to operate direct advertising, you have the right to object at any time to the processing of your personal data for the purpose of such advertising; this also applies to profiling insofar as it is associated with such direct advertising. If you object, your personal data will then no longer be used for direct advertising purposes (objection according to Art. 21 Para. 2 GDPR).
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Right of appeal to the competent supervisory authority
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            In the event of violations of the GDPR, those affected have the right to lodge a complaint with a supervisory authority, in particular in the Member State of their habitual residence, their place of work or the place of the alleged violation. The right to lodge a complaint is without prejudice to any other administrative or judicial remedy.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Right to data portability
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You have the right to have data that we process automatically on the basis of your consent or in fulfillment of a contract handed over to you or to a third party in a common, machine-readable format. If you request the direct transfer of the data to another person responsible, this will only be done to the extent that it is technically feasible.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            SSL or TLS encryption
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            For security reasons and to protect the transmission of confidential content, such as orders or inquiries that you send to us as the site operator, this site uses an SSL or TLS encryption. You can recognize an encrypted connection by the fact that the address line of the browser changes from "http://" to "https://" and by the lock symbol in your browser line.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If SSL or TLS encryption is activated, the data that you transmit to us cannot be read by third parties.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Encrypted payment transactions on this website
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If, after the conclusion of a fee-based contract, there is an obligation to send us your payment data (e.g. account number for direct debit authorization), this data is required for payment processing.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Payment transactions using the usual means of payment (Visa/MasterCard, direct debit) are carried out exclusively via an encrypted SSL or TLS connection. You can recognize an encrypted connection by the fact that the address line of the browser changes from "http://" to "https://" and by the lock symbol in your browser line.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            With encrypted communication, your payment data that you transmit to us cannot be read by third parties.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Information, blocking, deletion and correction
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Within the framework of the applicable legal provisions, you have the right to free information about your stored personal data, its origin and recipient and the purpose of the data processing and, if necessary, a right to correction, blocking or deletion of this data at any time. You can contact us at any time at the address given in the imprint if you have any further questions on the subject of personal data.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Right to restriction of processing
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You have the right to request the restriction of the processing of your personal data. You can contact us at any time at the address given in the imprint. The right to restriction of processing exists in the following cases:
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If you dispute the accuracy of your personal data stored by us, we usually need time to check this. For the duration of the examination, you have the right to request that the processing of your personal data be restricted. If the processing of your personal data happened/is happening unlawfully, you can request the restriction of data processing instead of deletion. If we no longer need your personal data, but you need it to exercise, defend or assert legal claims, you have the right to demand that the processing of your personal data be restricted instead of being deleted. If you have lodged an objection in accordance with Art. 21 (1) GDPR, your interests and ours must be weighed up.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If you have restricted the processing of your personal data, this data - apart from its storage - may only be used with your consent or to assert, exercise or defend legal claims or to protect the rights of another natural or legal person or for reasons of important public interest of the European Union or a Member State are processed.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Objecting to Promotional Emails
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We hereby object to the use of contact data published as part of the imprint obligation to send unsolicited advertising and information material. The site operators expressly reserve the right to take legal action in the event of unsolicited advertising being sent, such as spam e-mails.
            </p><br/>

            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">3. Data collection on our website</p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
                Cookies
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                Some of the websites use so-called cookies. Cookies do not damage your computer and do not contain viruses. Cookies serve to make our offer more user-friendly, effective and secure. Cookies are small text files that are stored on your computer and saved by your browser.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                Most of the cookies we use are so-called “session cookies”. They are automatically deleted after your visit. Other cookies remain stored on your end device until you delete them. These cookies enable us to recognize your browser on your next visit.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                You can set your browser so that you are informed about the setting of cookies and only allow cookies in individual cases, exclude the acceptance of cookies for certain cases or in general and activate the automatic deletion of cookies when the browser is closed. If cookies are deactivated, the functionality of this website may be restricted.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                Cookies that are required to carry out the electronic communication process or to provide certain functions you want (e.g. shopping cart function) are stored on the basis of Article 6 Paragraph 1 Letter f GDPR. The website operator has a legitimate interest in the storage of cookies for the technically error-free and optimized provision of its services. Insofar as other cookies (e.g. cookies for analyzing your surfing behavior) are stored, these are treated separately in this data protection declaration.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
                Server log files
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us.
            </p>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                These are:
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                Browser type and browser version Operating system used Referrer URL Host name of the accessing computer Time of the server request IP address.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                This data is not merged with other data sources.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                This data is collected on the basis of Article 6 (1) (f) GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of his website - the server log files must be recorded for this purpose.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
                Inquiry by e-mail, telephone or fax
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
                If you contact us by e-mail, telephone or fax, your inquiry including all resulting personal data (name, enquiry) will be stored and processed by us for the purpose of processing your request. We do not pass on this data without your consent.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This data is processed on the basis of Article 6 (1) (b) GDPR if your request is related to the fulfillment of a contract or is necessary to carry out pre-contractual measures. In all other cases, the processing is based on your consent (Art. 6 Para. 1 lit. a GDPR) and / or on our legitimate interests (Art. 6 Para. 1 lit. f GDPR), since we have a legitimate interest in the effective processing of inquiries addressed to us.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The data you sent to us via contact requests will remain with us until you request deletion, revoke your consent to storage or the purpose for data storage no longer applies (e.g. after your request has been processed). Mandatory legal provisions - in particular statutory retention periods - remain unaffected.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Registration on this site
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can register on our website to use additional functions on the site. We use the data entered for this purpose only for the purpose of using the respective offer or service for which you have registered. The mandatory information requested during registration must be provided in full. Otherwise we will refuse the registration.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            For important changes, such as the scope of the offer or technically necessary changes, we use the e-mail address provided during registration to inform you in this way.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The data entered during registration is processed on the basis of your consent (Article 6 (1) (a) GDPR). You can revoke any consent you have given at any time. An informal message by e-mail to us is sufficient. The legality of the data processing that has already taken place remains unaffected by the revocation.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The data collected during registration will be stored by us as long as you are registered on our website and will then be deleted. Statutory retention periods remain unaffected.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Processing of data (customer and contract data)
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We collect, process and use personal data only insofar as they are necessary for the establishment, content or change of the legal relationship (inventory data). This is based on Article 6 Paragraph 1 Letter b GDPR, which allows the processing of data to fulfill a contract or pre-contractual measures. We collect, process and use personal data about the use of our website (usage data) only to the extent necessary to enable the user to use the service or to bill the user.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The collected customer data will be deleted after completion of the order or termination of the business relationship. Statutory retention periods remain unaffected.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Data transmission upon conclusion of contract for online shops, dealers and goods dispatch
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We only transmit personal data to third parties if this is necessary in the context of contract processing, for example to the company entrusted with the delivery of the goods or the bank responsible for processing the payment. Any further transmission of the data does not take place or only if you have expressly consented to the transmission. Your data will not be passed on to third parties without your express consent, for example for advertising purposes.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The basis for data processing is Art. 6 Paragraph 1 lit. b GDPR, which allows the processing of data to fulfill a contract or pre-contractual measures.
            </p><br/>


            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">4. Analysis Tools and Advertising</p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Google Analytics
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This website uses functions of the web analysis service Google Analytics. The provider is Google Ireland Limited (“Google”), Gordon House, Barrow Street, Dublin 4, Ireland.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Google Analytics uses so-called "cookies". These are text files that are stored on your computer and that enable an analysis of your use of the website. The information generated by the cookie about your use of this website is usually transmitted to a Google server in the USA and stored there.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The storage of Google Analytics cookies and the use of this analysis tool are based on Article 6 Paragraph 1 lit. f GDPR. The website operator has a legitimate interest in analyzing user behavior in order to optimize both its website and its advertising.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            IP anonymization
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We have activated the IP anonymization function on this website. As a result, your IP address will be shortened by Google within member states of the European Union or in other contracting states of the Agreement on the European Economic Area before it is transmitted to the USA. Only in exceptional cases will the full IP address be sent to a Google server in the USA and shortened there. On behalf of the operator of this website, Google will use this information to evaluate your use of the website, to compile reports on website activity and to provide other services related to website activity and internet usage to the website operator. The IP address transmitted by your browser as part of Google Analytics will not be merged with other Google data.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            browser plug-in
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can prevent the storage of cookies by setting your browser software accordingly; we would like to point out to you however that in this case you will if applicable not be able to use all functions of this website in full. You can also prevent Google from collecting the data generated by the cookie and related to your use of the website (including your IP address) and from processing this data by Google by downloading the browser plug-in available under the following link and install:  https://tools.google.com/dlpage/gaoptout?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Objection against data collection
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can prevent Google Analytics from collecting your data by clicking on the following link. An opt-out cookie will be set to prevent your data from being collected on future visits to this website:  Disable Google Analytics [LL1].
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can find more information on how Google Analytics handles user data in Google's data protection declaration:  https://support.google.com/analytics/answer/6004245?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            order processing
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We have concluded an order processing contract with Google and fully implement the strict requirements of the German data protection authorities when using Google Analytics.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            storage duration
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Data stored by Google at the user and event level that is linked to cookies, user IDs (e.g. User ID) or advertising IDs (e.g. DoubleClick cookies, Android advertising ID) are anonymised after 14 months or deleted. You can find details on this under the following link:  https://support.google.com/analytics/answer/7667196?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Google Analytics Remarketing
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Our websites use the functions of Google Analytics Remarketing in connection with the cross-device functions of Google AdWords and Google DoubleClick. The provider is Google Ireland Limited (“Google”), Gordon House, Barrow Street, Dublin 4, Ireland.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This function makes it possible to link the advertising target groups created with Google Analytics Remarketing to the cross-device functions of Google AdWords and Google DoubleClick. In this way, interest-related, personalized advertising messages that have been adapted to you depending on your previous usage and surfing behavior on one end device (e.g. mobile phone) can also be displayed on another of your end devices (e.g. tablet or PC).
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If you have given your consent, Google will link your web and app browser history to your Google account for this purpose. In this way, the same personalized advertising messages can be placed on every device on which you log in with your Google account.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            To support this feature, Google Analytics collects Google-authenticated user IDs, which are temporarily linked to our Google Analytics data to define and create audiences for cross-device advertising.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can permanently object to cross-device remarketing/targeting by deactivating personalized advertising in your Google account; follow this link:  https://www.google.com/settings/ads/onweb/ .
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The summary of the recorded data in your Google account is based solely on your consent, which you can give or revoke with Google (Article 6 (1) (a) GDPR). In the case of data collection processes that are not merged in your Google account (e.g. because you do not have a Google account or have objected to the merger), the collection of data is based on Article 6 Paragraph 1 lit. f GDPR. The legitimate interest results from the fact that the website operator has an interest in the anonymous analysis of website visitors for advertising purposes.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Further information and the data protection regulations can be found in Google's data protection declaration at:  https://policies.google.com/technologies/ads?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Google AdWords and Google Conversion Tracking
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This website uses Google AdWords. AdWords is an online advertising program from Google Ireland Limited (“Google”), Gordon House, Barrow Street, Dublin 4, Ireland.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            As part of Google AdWords, we use so-called conversion tracking. If you click on an ad placed by Google, a cookie will be set for conversion tracking. Cookies are small text files that the Internet browser stores on the user's computer. These cookies lose their validity after 30 days and are not used to personally identify users. If the user visits certain pages of this website and the cookie has not yet expired, we and Google can recognize that the user clicked on the ad and was redirected to this page.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Each Google AdWords customer receives a different cookie. The cookies cannot be tracked through AdWords advertisers' websites. The information obtained using the conversion cookie is used to create conversion statistics for AdWords customers who have opted for conversion tracking. Customers find out the total number of users who clicked on their ad and were redirected to a page with a conversion tracking tag. However, they do not receive any information with which users can be personally identified. If you do not wish to participate in the tracking, you can object to this use by easily deactivating the Google conversion tracking cookie in your Internet browser under user settings.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The storage of "conversion cookies" and the use of this tracking tool are based on Article 6 Paragraph 1 lit. f GDPR. The website operator has a legitimate interest in analyzing user behavior in order to optimize both its website and its advertising.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can find more information about Google AdWords and Google Conversion Tracking in Google's data protection regulations:  https://policies.google.com/privacy?hl=de.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can set your browser so that you are informed about the setting of cookies and only allow cookies in individual cases, exclude the acceptance of cookies for certain cases or in general and activate the automatic deletion of cookies when the browser is closed. If cookies are deactivated, the functionality of this website may be restricted.
            </p><br/>


            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">5. Online Marketing and Affiliate Programs</p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Amazon Affiliate Program
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The site operators participate in the Amazon EU partner program. Amazon advertisements and links to the Amazon.de website are integrated on our pages, from which we can earn money through reimbursement of advertising costs. Amazon uses cookies to be able to trace the origin of the orders. This allows Amazon to recognize that you have clicked the partner link on our website.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            "Amazon cookies" are stored on the basis of Art. 6 lit. f GDPR. The website operator has a legitimate interest in this, since the amount of his affiliate remuneration can only be determined through the cookies.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            For more information on how Amazon uses data, see Amazon's privacy policy:  https://www.amazon.de/gp/help/customer/display.html/ref=footer_privacy?ie=UTF8&nodeId=3312401.
            </p><br/>


            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">6. Payment Providers and Resellers</p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            PayPal
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            On our website we offer, among other things, payment via PayPal. The provider of this payment service is:
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            PayPal (Europe) S.à.rl et Cie, SCA, 22-24 Boulevard Royal, L-2449 Luxembourg (hereinafter “PayPal”).
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If you choose to pay via PayPal, the payment details you enter will be sent to PayPal.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Your data is transmitted to PayPal on the basis of Article 6 (1) (a) GDPR (consent) and Article 6 (1) (b) GDPR (processing to fulfill a contract). You have the option to revoke your consent to data processing at any time. A revocation does not affect the effectiveness of past data processing operations.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            Stripes
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            The provider for customers within the EU is Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Ireland (hereinafter "Stripe").
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            Data transfer to the USA is based on the standard contractual clauses of the EU Commission. Details can be found here: https://stripe.com/de/privacy and https://stripe.com/de/guides/general-data-protection-regulation.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            You can read more about this in Stripe's data protection declaration under the following link: https://stripe.com/de/privacy
            </p><br/>



            <p class="font-sans font-bold text-black  mb-1 text-2xl title-font">7. Plugins and Tools</p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            a. Youtube
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This website / app integrates videos from the YouTube website. The website operator is Google Ireland Limited (“Google”), Gordon House, Barrow Street, Dublin 4, Ireland.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            If you visit one of our websites on which YouTube is integrated, a connection to the YouTube servers will be established. The YouTube server is informed which of our pages you have visited. Furthermore, YouTube can store various cookies on your end device.
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            With the help of these cookies, YouTube can receive information about visitors to this website. This information is used, among other things, to collect video statistics, to improve user-friendliness and to prevent attempts at fraud. The cookies remain on your end device until you delete them. If you are logged into your YouTube account, you enable YouTube to assign your surfing behavior directly to your personal profile. You can prevent this by logging out of your YouTube account. YouTube is used in the interest of an attractive presentation of our online offers. This represents a legitimate interest within the meaning of Article 6 Paragraph 1 Letter f GDPR. If a corresponding consent has been requested, the processing takes place exclusively on the basis of Article 6 Paragraph 1 Letter A GDPR; the consent can be revoked at any time. Further information on handling user data can be found in YouTube's data protection declaration at: https://policies.google.com/privacy?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            b. Google Web Fonts
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This site uses so-called web fonts provided by Google for the uniform display of fonts. The Google Fonts are installed locally. There is no connection to Google servers. Further information on Google Web Fonts can be found at  https://developers.google.com/fonts/faq  and in Google's data protection declaration:  https://policies.google.com/privacy?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            c. Google Maps
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            This site uses the Google Maps map service via an API. The provider is Google Ireland Limited (“Google”), Gordon House, Barrow Street, Dublin 4, Ireland. In order to use the functions of Google Maps, it is necessary to save your IP address. This information is usually transmitted to a Google server in the USA and stored there. The provider of this site has no influence on this data transfer. Google Maps is used in the interest of an attractive presentation of our online offers and to make it easier to find the places we have indicated on the website. This represents a legitimate interest within the meaning of Article 6 Paragraph 1 Letter f GDPR. If a corresponding consent has been requested, the processing takes place exclusively on the basis of Article 6 Paragraph 1 Letter a GDPR; the consent can be revoked at any time. More information on handling user data can be found in Google's data protection declaration: https://policies.google.com/privacy?hl=de.
            </p><br/>
            <p class="font-sans font-bold text-black  mb-1 text-xl title-font">
            i.e. Changes to this Privacy Policy
            </p><br/>
            <p class="font-sans font-semibold text-black mb-1 text-sm title-font">
            We reserve the right to change this data protection declaration. The current version of the data protection declaration is always  available at heidi-app.de/datenschutz.
            </p><br/>
        </div>

        <footer class="text-center lg:text-left bg-black text-white">
				<div class="mx-6 py-10 text-center md:text-left">
					<div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div class="">
							<h6
								class="
                    uppercase
                    font-semibold
                    mb-4
                    flex
                    items-center
                    justify-center
                    md:justify-start font-sans
                    "
							>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="fas"
									data-icon="cubes"
									class="w-4 mr-3"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"
									></path>
								</svg>
								Smart Regions
							</h6>
							<div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
								<a href="https://www.facebook.com/people/HEIDI-Heimat-Digital/100063686672976/" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
								</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
								</a>
								<a href="https://www.instagram.com/heidi.app/?hl=de" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
								</a>
								<a href="https://www.linkedin.com/company/heidi-heimat-digital/mycompany/" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
								</svg>
								</a>
							</div>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Learn More
							</h6>
							<p class="mb-4">
								<a href="https://heidi-app.de/" class="text-gray-600 font-sans">
									developer community
								</a>
							</p>
							<p class="mb-4">
								<a href="https://heidi-app.de/" class="text-gray-600 font-sans">
									Contact us
								</a>
							</p>
							<p class="mb-4">
								<a href="/login" class="text-gray-600 font-sans">
									Log in
								</a>
							</p>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Leagal
							</h6>
							<p class="mb-4">
								<a href="/ImprintPage" class="text-gray-600 font-sans">
									imprint
								</a>
							</p>
							<p class="mb-4">
								<a href="/PrivacyPolicy" class="text-gray-600 font-sans">
									terms and conditions
								</a>
							</p>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
									Data protection
								</a>
							</p>
							<p>
								<a href="#!" class="text-gray-600 font-sans">
									Right of withdrawal
								</a>
							</p>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Secure the APP now!
							</h6>
						</div>
					</div>
				</div>
				<div class="text-center p-6 bg-black">
					<div className="my-4 text-gray-600 h-[1px]"></div>
					<span class="font-sans">
						© HeidiTheme 2023. All rights reserved. Created by{" "}
					</span>
					<a
						class="text-white font-semibold underline font-sans"
						href="https://heidi-app.de/"
					>
						HeimatDigital
					</a>
				</div>
			</footer>
    </section>
  )
}
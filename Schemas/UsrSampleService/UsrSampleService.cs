namespace BPMSoft.Configuration
{
    using System;
    using System.Configuration;
    using System.ServiceModel;
    using System.ServiceModel.Web;
    using System.ServiceModel.Activation;
    using BPMSoft.Common;
    using BPMSoft.Core;
    using BPMSoft.Web.Common;

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class UsrSampleService : BaseService


    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "TestMethod", BodyStyle = WebMessageBodyStyle.Wrapped,
            RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        /// <summary>
        /// todo:
        /// </summary>
        /// <returns>������ ������.</returns>
        public string MyMethod()
        {
            var userName = UserConnection.CurrentUser.Name;

            var account = new Account(UserConnection);
            account.SetDefColumnValues();
            account.Zip = "09563xxxx";
            account.Name = "New company name";
            account.Save(true, false);

            var contact = new Contact(UserConnection);
            contact.JobTitle = "Boss";
            contact.SetDefColumnValues();
            contact.SetColumnValue("Name", "New contact");
            contact.OwnerId = UserConnection.CurrentUser.ContactId;
            contact.MobilePhone = "333-444-2222";
            contact.Save();

            var bookStore = new UsrBookStore(UserConnection);
            bookStore.SetDefColumnValues();
            bookStore.UsrName = userName;
            bookStore.UsrString1 = "����� ������ �� ���-�������";
            bookStore.UsrInteger1 = 111;

            bookStore.Save();
            this.ToString();
            var s = this.ToString().Split('.');
            var className =  s[s.Length - 1];
            return className + " - everything is OK";
        }
    }
}
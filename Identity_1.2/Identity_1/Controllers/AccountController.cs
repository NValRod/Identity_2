using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Identity_1.Models;
using Microsoft.Ajax.Utilities;
using System.DirectoryServices.AccountManagement;




namespace Identity_1.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(string domain, string userN, string userP)
        {
            string error = null;
            string dns = GetDomainDNS(domain);
            bool isValid = false;
            try
            {
                using (var ctx = new PrincipalContext(ContextType.Domain, dns, userN, userP))
                {
                    isValid = ctx.ValidateCredentials(userN, userP, ContextOptions.Negotiate);
                }
                if (isValid)
                {

                    using (analysts_dbEntities db = new analysts_dbEntities())
                    {
                        var users = db.Identity_Users_roles.Where(x => x.userRed.ToLower() == userN.ToLower() && x.userStatus == true ).FirstOrDefault();
                        if (users != null)
                        {
                            Session["userName"] = users.userName;
                            Session["roleUser"] = users.IdRol;
                            FormsAuthentication.SetAuthCookie(userN, true);
                            return RedirectToAction("IdentityManagement", "Home");
                        }
                    }

                }
                else
                {
                    error = "Incorrect User or password ";
                    ViewBag.error = error;
                }

            }
            catch (Exception)
            {
                return View(new { error = "there was an exception during execution" });
            }
            return View();
        }

        private string GetDomainDNS(string domain)
        {
            switch (domain)
            {
                case "AMER":
                    return "10.246.245.2:3268";
                case "APC":
                    return "apc.sitel-world.net";
                case "APAC":
                    return "10.246.245.5:3268";
                case "EMEA":
                case "BLUE_EMEA":
                    return "10.246.245.2:3268";
                case "LAT":
                    return "lat.sitel-world.net";
                case "NAC":
                    return "nac.sitel-world.net";
                default:
                    return null;
            }
        }

        [Authorize]
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login", "Account");
        }
    }
}
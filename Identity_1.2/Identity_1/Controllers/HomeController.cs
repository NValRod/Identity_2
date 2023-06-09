using Identity_1.Models;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;



namespace Identity_1.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {


        public ActionResult Index()
        {
            
            return View();
        }

        [HttpGet]
        public ActionResult GetProjectCodes()
        {
    
            // It must be write this line every time some method is added
            using (analysts_dbEntities db = new analysts_dbEntities())
            {
                var users = db.Identity_Users_roles.Where(x => x.userRed.ToLower() == User.Identity.Name.ToLower() && x.userStatus == true).FirstOrDefault();
                if (users != null)
                {
                    ViewBag.userName = users.userName;
                    ViewBag.roleUser = users.IdRol;
                }
            }

            GetCountries();
            return View();
        }


        // Get the countries list
        public JsonResult GetCountries()
        {

            List<string> countries = new List<string>();
            using (var client  = new HttpClient())
            {
                client.BaseAddress = new Uri("https://identity-management-api.dev.sykes.com/");
                client.DefaultRequestHeaders.Add("apiKey", "1C2CA9A6-96D3-42C2-939E-7C7C632A714B");

                var respTalk = client.GetAsync("/api/projectcodes/GetDataCountries");
                respTalk.Wait();

                var result = respTalk.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readJob = result.Content.ReadAsAsync<List<string>>();
                    readJob.Wait();
                    countries = readJob.Result;
                }
                else
                {
                    countries = new List<string>();

                }
                ViewBag.ListCountries = countries;
                return Json(countries, JsonRequestBehavior.AllowGet);

            }
        }



        // Get the sites list
        public JsonResult GetSites(string country)
        {

            List<string> sites = new List<string>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://identity-management-api.dev.sykes.com/");
                client.DefaultRequestHeaders.Add("apiKey", "1C2CA9A6-96D3-42C2-939E-7C7C632A714B");
                
                var respTalk = client.PostAsync("/api/projectcodes/GetDataSites?country=" + country, null);
                respTalk.Wait();

                var result = respTalk.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readJob = result.Content.ReadAsAsync<List<string>>();
                    readJob.Wait();
                    sites = readJob.Result;
                }
                else
                {
                    sites = new List<string>();

                }
                ViewBag.ListSites = sites;
                return Json(sites, JsonRequestBehavior.AllowGet);

            }
        }


        // Get the clients list
        public JsonResult GetClients(string country, string sites)
        {

            List<string> sitesClients = new List<string>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://identity-management-api.dev.sykes.com/");
                client.DefaultRequestHeaders.Add("apiKey", "1C2CA9A6-96D3-42C2-939E-7C7C632A714B");

                var respTalk = client.PostAsync("/api/projectcodes/GetDataClients?country=" + country + "&siteName=" + sites, null);
                respTalk.Wait();

                var result = respTalk.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readJob = result.Content.ReadAsAsync<List<string>>();
                    readJob.Wait();
                    sitesClients = readJob.Result;
                }
                else
                {
                    sitesClients = new List<string>();

                }
                ViewBag.ListClients = sitesClients;
                return Json(sitesClients, JsonRequestBehavior.AllowGet);

            }
        }


        // Get the projects list
        public JsonResult GetProjects(string country, string sites, string clients)
        {

            List < Projects> projects = new List<Projects>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://identity-management-api.dev.sykes.com/");
                client.DefaultRequestHeaders.Add("apiKey", "1C2CA9A6-96D3-42C2-939E-7C7C632A714B");

                var respTalk = client.PostAsync("/api/projectcodes/GetDataProjects?country=" + country + "&siteName=" + sites + "&client=" + clients, null);
                respTalk.Wait();

                var result = respTalk.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readJob = result.Content.ReadAsAsync<List<Projects>>();
                    readJob.Wait();
                    projects = readJob.Result;
                }
                else
                {
                    projects = new List<Projects>();

                }
                ViewBag.ListProjects = projects;
                return Json(projects, JsonRequestBehavior.AllowGet);

            }
        }



        [HttpPost]
        public JsonResult GetProjectCodes(ProjectCodes model)
        {
            object returnVal = new object();

            List<ProjectCodes> projectCodesList = new List<ProjectCodes>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://identity-management-api.dev.sykes.com/");

                client.DefaultRequestHeaders.Add("apiKey", "1C2CA9A6-96D3-42C2-939E-7C7C632A714B");

                var data = new
                {
                    sf_country = (model.sf_country != ".::Select::.") ? model.sf_country : null,
                    site_name = (model.site_name != ".::Select::.") ? model.site_name: null,
                    parent_client_name = (model.parent_client_name != ".::Select::.") ? model.parent_client_name : null,
                    sf_project_code = (model.sf_project_code != ".::Select::.") ? model.sf_project_code : null,
                    blue = model.blue,
                    red = model.red
                };

                var stringPayload = JsonConvert.SerializeObject(data);
                var httpContent = new StringContent(stringPayload, Encoding.UTF8, "application/json");

                var responseTalk = client.PostAsync("/api/projectcodes/GetProjectCodes", httpContent);
                responseTalk.Wait();

                var result = responseTalk.Result;

                if (result.IsSuccessStatusCode)
                {
                    //var readJob = result.Content.ReadAsAsync<ProjectCodes>();
                    var readJob = result.Content.ReadAsStringAsync();
                    readJob.Wait();
                    projectCodesList = JsonConvert.DeserializeObject<List<ProjectCodes>>(readJob.Result);


                    returnVal = new
                    {
                        code = 1,
                        content = projectCodesList
                    };
                }
                else
                {
                    returnVal = new
                    {
                        code = 0
                    };
                }
            }

            return Json(returnVal, JsonRequestBehavior.AllowGet);

        }
    }

    
   
}

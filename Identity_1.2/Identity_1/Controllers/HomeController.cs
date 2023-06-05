using Identity_1.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
            return View();
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
                    oracle_site_id = model.oracle_site_id,
                    sf_country = model.sf_country,
                    site_name = model.site_name,
                    parent_client_name = model.parent_client_name,
                    sf_project_code = model.sf_project_code,
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
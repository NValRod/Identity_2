using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Identity_1.Models
{
    public class ProjectCodes
    {
        public string parent_client_name { get; set; }
        public string sf_company_description { get; set; }
        public string sf_country { get; set; }
        public string site_name { get; set; }
        public string department_name { get; set; }
        public string lob_name { get; set; }
        public string sf_project_code { get; set; }
        public bool blue { get; set; }
        public bool red { get; set; }
        public string oracle_site_id { get; set; }
    }

}
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Identity_1.Models;

namespace Identity_1.Controllers
{
    [Authorize]
    public class Identity_Users_rolesController : Controller
    {
        private analysts_dbEntities db = new analysts_dbEntities();

        // GET: Identity_Users_roles
        public ActionResult Index()
        {
            var identity_Users_roles = db.Identity_Users_roles.Where(x => x.userStatus == true).Include(i => i.role_identity_nv);
            var dataUser = db.Identity_Users_roles.Where(x => x.userRed.ToLower() == User.Identity.Name).FirstOrDefault();

            if ( dataUser.IdRol != 1)
            {
                return RedirectToAction("GetProjectCodes", "Home");
            }
            return View(identity_Users_roles.ToList());
        }

        // GET: Identity_Users_roles/Create
        public ActionResult Create()
        {
            ViewBag.IdRol = new SelectList(db.role_identity_nv, "IdRol", "descript");

            var dataUser = db.Identity_Users_roles.Where(x => x.userRed.ToLower() == User.Identity.Name).FirstOrDefault();

            if (dataUser.IdRol != 1)
            {
                return RedirectToAction("GetProjectCodes", "Home");
            }
            return View();
        }

        // POST: Identity_Users_roles/Create

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "userId,userName,userEmail,userPassword,userStatus,userRed,IdRol")] Identity_Users_roles identity_Users_roles)
        {


            if (ModelState.IsValid)
            {
                db.Identity_Users_roles.Add(identity_Users_roles);
                db.SaveChanges();
                return RedirectToAction("Index");

            }
            ViewBag.IdRol = new SelectList(db.role_identity_nv, "IdRol", "descript", identity_Users_roles.IdRol);
            return View(identity_Users_roles);
        }

        // GET: Identity_Users_roles/Edit/5
        public ActionResult Edit(int? id)
        {
            var dataUser = db.Identity_Users_roles.Where(x => x.userRed.ToLower() == User.Identity.Name).FirstOrDefault();

            if (dataUser.IdRol != 1)
            {
                return RedirectToAction("GetProjectCodes", "Home");
            }
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Identity_Users_roles identity_Users_roles = db.Identity_Users_roles.Find(id);
            if (identity_Users_roles == null)
            {
                return HttpNotFound();
            }
            ViewBag.IdRol = new SelectList(db.role_identity_nv, "IdRol", "descript", identity_Users_roles.IdRol);
            return View(identity_Users_roles);
        }

        // POST: Identity_Users_roles/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "userId,userName,userEmail,userPassword,userStatus,userRed,IdRol")] Identity_Users_roles identity_Users_roles)
        {
            if (ModelState.IsValid)
            {
                db.Entry(identity_Users_roles).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.IdRol = new SelectList(db.role_identity_nv, "IdRol", "descript", identity_Users_roles.IdRol);
            return View(identity_Users_roles);
        }

        // GET: Identity_Users_roles/Delete/5
        public ActionResult Delete(int? id)
        {
            var dataUser = db.Identity_Users_roles.Where(x => x.userRed.ToLower() == User.Identity.Name).FirstOrDefault();

            if (dataUser.IdRol != 1)
            {
                return RedirectToAction("GetProjectCodes", "Home");
            }
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Identity_Users_roles identity_Users_roles = db.Identity_Users_roles.Find(id);
            if (identity_Users_roles == null)
            {
                return HttpNotFound();
            }
            return View(identity_Users_roles);
        }

        // POST: Identity_Users_roles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Identity_Users_roles identity_Users_roles = db.Identity_Users_roles.Where(x => x.userId == id).FirstOrDefault();
            identity_Users_roles.userStatus = false;
            db.Entry(identity_Users_roles).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}

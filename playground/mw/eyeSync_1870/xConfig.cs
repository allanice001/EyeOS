using System;
using System.Collections.Generic;
using System.Text;

namespace eyeSync
{
    /// <summary>
    /// Contains a virtual copy of the static Config for Serialisation
    /// </summary>
    public class xConfig
    {
        string pass;
        public string Password
        {
            get { return pass; }
            set { pass = value; }
        }

        bool secure;

        public bool Secure
        {
            get { return secure; }
            set { secure = value; }
        }

        string user;
        public string User
        {
            get { return user; }
            set { user = value; }
        }

        string server;
        public string Server
        {
            get { return server; }
            set { server = value; }
        }

        string serverdir;
        public string ServerDir
        {
            get { return serverdir; }
            set { serverdir = value; }
        }

        public string CompleteServerURL
        {
            get { return "http://" + server + "/" + serverdir + "index.php?api=1"; }
        }

        List<SyncJob> jobs;
        public List<SyncJob> Jobs
        {
            get { return jobs; }
            set { jobs = value; }
        }


        public xConfig()
        {
            pass = Config.Password;
            user = Config.User;
            server = Config.Server;
            serverdir = Config.ServerDir;
            jobs = Config.Jobs;
            secure = Config.HTTPS;
        }

        /// <summary>
        /// Sets the static Config to the data from this virtual copy
        /// </summary>
        public void ToRealConfig()
        {
            Config.Password = pass;
            Config.User = user;
            Config.Server = server;
            Config.ServerDir = serverdir;
            Config.Jobs = jobs;
            Config.HTTPS = secure;
        }
    }
}

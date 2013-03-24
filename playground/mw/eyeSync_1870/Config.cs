using System;
using System.Collections.Generic;
using System.Text;

namespace eyeSync
{
    /// <summary>
    /// The main configuration for eyeSync
    /// </summary>
    static class Config
    {
        static bool secure = false;

        public static bool HTTPS
        {
            get { return secure; }
            set { secure = value; }
        }

        public static string HTTPS_readable
        {
            get { if (secure == true) return "https://"; else return "http://"; }
            set { if (value == "https://") secure = true; else secure = false; }
        }

        static string pass = "test";
        /// <summary>
        /// The Password for the given User
        /// </summary>
        public static string Password
        {
            get { return pass; }
            set { pass = value; }
        }

        static string user = "root";
        /// <summary>
        /// The Username to connect to the given eyeos-Server
        /// </summary>
        public static string User
        {
            get { return user; }
            set { user = value; }
        }

        static string server = "127.0.0.1";
        /// <summary>
        /// The Domain or IP of the eyeos-Server to connect with
        /// </summary>
        public static string Server
        {
            get { return server; }
            set { server = value; }
        }

        static string serverdir = "eye/";
        /// <summary>
        /// The Directory that completes the Domain or IP to a full URL
        /// </summary>
        public static string ServerDir
        {
            get { return serverdir; }
            set { serverdir = value; }
        }
        /// <summary>
        /// The full URL of the eyeos-Server to connect with
        /// </summary>
        public static string CompleteServerURL
        {
            get { return HTTPS_readable + server + "/" + serverdir + "index.php?api=1"; }
        }

        static List<SyncJob> jobs = new List<SyncJob>();
        /// <summary>
        /// A list of Synchronisation-Jobs
        /// </summary>
        public static List<SyncJob> Jobs
        {
            get { return jobs; }
            set { jobs = value; }
        }

    }
}

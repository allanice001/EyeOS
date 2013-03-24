using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;

namespace eyeSync
{
    public class SyncJob
    {
        private bool isActive;
        public bool IsActive
        {
            get { return isActive; }
            set { isActive = value; }
        }

        private DateTime lastrun;
        public DateTime LastRun
        {
            get { return lastrun; }
            set { lastrun = value; }
        }

        public SyncJob()
        {
            isActive = false;
            lastrun = DateTime.Now;
        }
        public SyncJob(string local, string remote, string directionReadableLong, string typeReadable, string updateRangeReadable)
        {
            Local = local;
            Remote = remote;
            DirectionReadableLong = directionReadableLong;
            TypeReadable = typeReadable;
            UpdateRangeReadable = updateRangeReadable;
            isActive = false;
            lastrun = DateTime.Now;
        }

        private int direction;
        public int Direction
        {
            get { return direction; }
            set { direction = value; }
        }
        public string DirectionReadableLong
        {
            get
            {
                if (direction == -1) return langs.eyeSync.remote + " " + langs.eyeSync.to + " " + langs.eyeSync.local;
                if (direction == 0) return langs.eyeSync.synchronize + " / " + langs.eyeSync.merge;
                if (direction == 1) return langs.eyeSync.local + " " + langs.eyeSync.to + " " + langs.eyeSync.remote;
                return "";
            }
            set
            {
                if (value == langs.eyeSync.remote + " " + langs.eyeSync.to + " " + langs.eyeSync.local) direction = -1;
                if (value == langs.eyeSync.synchronize + " / " + langs.eyeSync.merge) direction = 0;
                if (value == langs.eyeSync.local + " " + langs.eyeSync.to + " " + langs.eyeSync.remote) direction = 1;
            }
        }
        public string DirectionReadableShort
        {
            get 
            {
                if (direction == -1) return "<<";
                if (direction == 0) return "<< >>";
                if (direction == 1) return ">>";
                return "";
            }
            set
            {
                if (value == "<<") direction = -1;
                if (value == "<< >>") direction = 0;
                if (value == ">>") direction = 1;
            }
        }

        private string local;
        public string Local
        {
            get { return local; }
            set { local = value; }
        }

        private string remote;
        public string Remote
        {
            get { return remote; }
            set { remote = value; }
        }

        private bool type;
        public bool IsAutomatic
        {
            get { return type; }
            set { type = value; }
        }
        public bool IsManual
        {
            get { return !type; }
            set { type = !value; }
        }
        public string TypeReadable
        {
            get
            {
                if (type == true) return langs.eyeSync.automatic;
                return langs.eyeSync.manual;
            }
            set
            {
                if (value == langs.eyeSync.automatic) type = true;
                else if (value == langs.eyeSync.manual) type = false;
            }
        }

        private int updateRange;
        public int UpdateRange
        {
            get { return updateRange; }
            set { updateRange = value; }
        }
        public string UpdateRangeReadable
        {
            get 
            {
                if (updateRange <= 60) return updateRange.ToString() + " " + langs.eyeSync.minutes;
                if (updateRange == 1440) return langs.eyeSync.day;
                return ((int)(updateRange / 60)).ToString() + " " + langs.eyeSync.hours;
            }
            set
            {
                if (value.EndsWith(langs.eyeSync.minutes)) updateRange = int.Parse(value.Replace(" "+langs.eyeSync.minutes,""));
                if (value == langs.eyeSync.day) updateRange = 1440;
                if (value.EndsWith(langs.eyeSync.hours)) updateRange = int.Parse(value.Replace(" " + langs.eyeSync.hours, ""))*60;
            }
        }

        public void RunJob(System.Windows.Forms.ListViewItem item, System.Windows.Forms.ToolStripStatusLabel status)
        {
            if (!isActive)
            {
                isActive = true;
                BackgroundWorker bw = new BackgroundWorker();
                bw.WorkerReportsProgress = true;
                bw.ProgressChanged += new ProgressChangedEventHandler(RunJob_BackInfo);
                bw.DoWork += new DoWorkEventHandler(RunJob_RealJob);
                List<object> list = new List<object>();
                list.Add(item);
                list.Add(status);
                bw.RunWorkerAsync(list);
            }
        }

        void RunJob_RealJob(object sender, DoWorkEventArgs e)
        {
            ((BackgroundWorker)sender).ReportProgress(0, e.Argument);
            eyeOS eye = new eyeOS();
            eye.setCurrentUserDir();
            if (Direction ==1)
            {
                string[] files = System.IO.Directory.GetFiles(Local+"\\","*",System.IO.SearchOption.AllDirectories);
                int num = 0;
                foreach (string localfile in files)
                {
                    ((BackgroundWorker)sender).ReportProgress(files.Length-num, e.Argument);
                    string remotefile = remote + localfile.Replace(Local, "").Replace('\\', '/');
                    eye.uploadFile(localfile, remotefile);
                    num++;
                }
            }
            else if (Direction == -1)
            {
                string[] files = eye.getDirContent(remote);
                int num = 0;
                foreach (string remotefile in files)
                {
                    ((BackgroundWorker)sender).ReportProgress(files.Length - num, e.Argument);
                    string localfile = local + "\\" + remotefile;
                    eye.downloadFile(remote + "/" + remotefile, localfile);
                    num++;
                }
            }
            else if (Direction == 0)
            {
                string[] files = System.IO.Directory.GetFiles(Local + "\\", "*", System.IO.SearchOption.AllDirectories);
                int num = 0;
                foreach (string localfile in files)
                {
                    num++;
                    ((BackgroundWorker)sender).ReportProgress(files.Length - (num - 1), e.Argument);
                    if (new System.IO.FileInfo(localfile).Name.StartsWith(".eyeSyncInfo__")) continue;
                    string remotefile = remote + localfile.Replace(Local, "").Replace('\\', '/');
                    eye.updateFile(remotefile,localfile);
                }
            }
            ((BackgroundWorker)sender).ReportProgress(-1, e.Argument);
            isActive = false;

        }

        void RunJob_BackInfo(object sender, ProgressChangedEventArgs e)
        {
            if (((System.Windows.Forms.ListViewItem)((List<object>)e.UserState)[0]).ImageIndex == 10) ((System.Windows.Forms.ListViewItem)((List<object>)e.UserState)[0]).ImageIndex = 8;
            else ((System.Windows.Forms.ListViewItem)((List<object>)e.UserState)[0]).ImageIndex = 10;

            if (e.ProgressPercentage == -1)
            {
                ((System.Windows.Forms.ListViewItem)((List<object>)e.UserState)[0]).ImageIndex = 9;
                ((System.Windows.Forms.ToolStripStatusLabel)((List<object>)e.UserState)[1]).Text = langs.eyeSync.ready;
            }
            else ((System.Windows.Forms.ToolStripStatusLabel)((List<object>)e.UserState)[1]).Text = e.ProgressPercentage.ToString() + " " + langs.eyeSync.files_in_progress;
        }



    }
}

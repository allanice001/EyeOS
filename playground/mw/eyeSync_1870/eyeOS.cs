using System;
using System.Collections.Generic;
using System.Text;
using eyeSync.XmlRpc;
using System.ComponentModel;
using System.Security.Cryptography;

namespace eyeSync
{
    /// <summary>
    /// Class to connect to eyeos
    /// </summary>
    public class eyeos
    {
        Ieyeos connect; 
        string homepath;

        public eyeos()
        {
            connect = XmlRpcProxyGen.Create<Ieyeos>();
        }

        /// <summary>
        /// Method to get the content of a directory
        /// </summary>
        /// <param name="path">The path to the directory</param>
        /// <returns>all files and folders that are in that directory</returns>
        public string[] getDirContent(string path)
        {
            string[] a;
            if (path.StartsWith(homepath))
            {
                a = new string[1] { path };
            }
            else
            {
                a = new string[1] { homepath + "files/" + path };
            }
            string[] online = connect.service_vfs_getDirContent(Config.User, Config.Password, a);
            for (int i = 0; i < online.Length; i++)
            {
                online[i] = online[i].Replace(a[0]+"/", "");
            }
            return online;
        }

        /// <summary>
        /// Method to get the content of a directory and its subdirectorys
        /// </summary>
        /// <param name="path">The path to the directory</param>
        /// <returns>all files and folders that are in that directory and its subdirectorys</returns>
        public string[] getEveryDirContent(string path)
        {
            string[] a;
            if (path.StartsWith(homepath))
            {
                a = new string[1] { path };
            }
            else
            {
                a = new string[1] { homepath + "files/" + path };
            }
            string[] online = connect.service_vfs_getFolderList(Config.User, Config.Password, a);
            for (int i = 0; i < online.Length; i++)
            {
                online[i] = online[i].Replace(a[0] + "/", "");
            }
            return online;
        }

        /// <summary>
        /// Sets the Homepath variable. Needed for this object to work probably
        /// </summary>
        public void setCurrentUserDir()
        {
            object[] a = new object[0];
            homepath = connect.service_um_getCurrentUserDir(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Checks, if a file exists or not
        /// </summary>
        /// <param name="file">The path to the file to check</param>
        /// <returns>True, if file exists, or false, if not</returns>
        public bool fileExists(string file)
        {
            object[] a;
            if (file.StartsWith(homepath))
            {
                a = new object[1] {file};
            }
            else
            {
                a = new object[1] {homepath + "files/" + file};
            }
            return connect.service_vfs_fileExists(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Checks, if a path goes to a directory
        /// </summary>
        /// <param name="file">The path to check</param>
        /// <returns>True, if its a dir, or false, if not</returns>
        public bool isDir(string dir)
        {
            object[] a;
            if (dir.StartsWith(homepath))
            {
                a = new object[1] { dir };
            }
            else
            {
                a = new object[1] { homepath + "files/" + dir };
            }
            return connect.service_vfs_isDir(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Checks, if a path goes to a file
        /// </summary>
        /// <param name="file">The path to check</param>
        /// <returns>True, if its a file, or false, if not</returns>
        public bool isFile(string file)
        {
            object[] a;
            if (file.StartsWith(homepath))
            {
                a = new object[1] { file };
            }
            else
            {
                a = new object[1] { homepath + "files/" + file };
            }
            return !connect.service_vfs_isDir(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Clears a file (so that it has no content)
        /// </summary>
        /// <param name="file">The path to the file to clear</param>
        public void clearFile(string file)
        {
            object[] a;
            if (file.StartsWith(homepath))
            {
                a = new object[1] { file };
            }
            else
            {
                a = new object[1] { homepath + "files/" + file };
            }
            connect.service_vfs_erase(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Creates a new cleared file
        /// </summary>
        /// <param name="file">The path to the file, that should be created</param>
        public void createFile(string file)
        {
            object[] a;
            if (file.StartsWith(homepath))
            {
                a = new object[1] { file };
            }
            else
            {
                a = new object[1] { homepath + "files/" + file };
            }
            connect.service_vfs_create(Config.User, Config.Password, a);
        }
        /// <summary>
        /// Creates a new blanc directory
        /// </summary>
        /// <param name="file">The path to the dir, that should be created</param>
        public void createDir(string dir)
        {
            object[] a;
            if (dir.StartsWith(homepath))
            {
                a = new object[1] { dir };
            }
            else
            {
                a = new object[1] { homepath + "files/" + dir };
            }
            connect.service_vfs_mkdir(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Appends some bytes to a file
        /// </summary>
        /// <param name="file">The path to the file, that should be appended</param>
        /// <param name="buffer">The bytes, that should be appended</param>
        public void appendToFile(string file, byte[] buffer)
        {
            appendToFile(file, Convert.ToBase64String(buffer));
        }

        /// <summary>
        /// Appends some bytes to a file
        /// </summary>
        /// <param name="file">The path to the file, that should be appended</param>
        /// <param name="base64content">The base64 coded bytes, that should be appended</param>
        public void appendToFile(string file, string base64content)
        {
            object[] a;
            if (file.StartsWith(homepath))
            {
                a = new object[2] { file, base64content };
            }
            else
            {
                a = new object[2] { homepath + "files/" + file, base64content };
            }
            connect.service_vfs_appendToFileBinary(Config.User, Config.Password, a);
        }

        /// <summary>
        /// Loads the content of a file
        /// </summary>
        /// <param name="file">The path to the file, that should be loaded</param>
        /// <returns>The content of the file base64/encoded</returns>
        public string loadFile(string file)
        {
            object[] a;
            if (file.StartsWith(homepath))
            {
                a = new object[1] { file };
            }
            else
            {
                a = new object[1] { homepath + "files/" + file };
            }
            return connect.service_vfs_getFileBinary(Config.User, Config.Password, a);

        }


        /// <summary>
        /// Uploads a file to the eyeos-Server
        /// </summary>
        /// <param name="fileOffline">The complete path to the file</param>
        /// <param name="fileOnline">The path, the file should be saved in</param>
        /// <returns>True, if it works, false, if not</returns>
        public bool uploadFile(string fileOffline, string fileOnline)
        {
            if (!System.IO.File.Exists(fileOffline)) return false;
            if (new System.IO.FileInfo(fileOffline).Name.StartsWith(".eyeSyncInfo__")) return false;
            if (fileExists(fileOnline))
            {
                clearFile(fileOnline);
            }
            else
            {
                createFile(fileOnline);
            }
            string impact = fileOnline.Substring(0, fileOnline.LastIndexOf('/'));
            bool madedic = true;
            while (!fileExists(impact))
            {
                impact = fileOnline.Substring(0, impact.LastIndexOf('/'));
                madedic = false;
            }
            while (!madedic)
            {
                impact = fileOnline.Substring(0, fileOnline.IndexOf('/', impact.Length + 1));
                createDir(impact);
                if (impact == fileOnline.Substring(0, fileOnline.LastIndexOf('/'))) madedic = true;
            }
            System.IO.FileStream f = System.IO.File.OpenRead(fileOffline);
            int packsize = 4096;
            byte[] buffer = new byte[packsize];
            bool done = false;
            while (!done)
            {
                if (f.Length - f.Position > packsize)
                {
                    f.Read(buffer, 0, packsize);
                }
                else
                {
                    buffer = new byte[f.Length - f.Position];
                    f.Read(buffer, 0, (int)(f.Length - f.Position));
                    done = true;
                }
                appendToFile(fileOnline, buffer);
            }
            createSyncFile(fileOffline);
            return true;
        }

        /// <summary>
        /// Synchronizes a file with the eyeos-Server
        /// </summary>
        /// <param name="fileOnline">The path to the online file</param>
        /// <param name="fileOffline">The complete path to the offline file</param>
        /// <returns>True, if it works, false, if not</returns>
        public bool updateFile(string fileOnline, string fileOffline)
        {
            bool upload = false;
            bool download = false;

            download = fileExists(fileOnline);
            upload = System.IO.File.Exists(fileOffline);
            if (upload && download)
            {
                upload = false;
                download = false;
            }
            else if (upload && !download)
            {
                return uploadFile(fileOffline, fileOnline);
            }
            else if (download && !upload)
            {
                return downloadFile(fileOnline, fileOffline);
            }

            download = isFileOnlineChanged(fileOffline, fileOnline);
            upload = isFileOfflineChanged(fileOffline);
            if (upload && download)
            {
                System.Windows.Forms.DialogResult res = System.Windows.Forms.MessageBox.Show(langs.eyeSync.file_changed_both.Replace("{1}",new System.IO.FileInfo(fileOffline).Name) + Environment.NewLine + langs.eyeSync.yes_online + Environment.NewLine + langs.eyeSync.no_offline + Environment.NewLine + langs.eyeSync.cancel_ignore, langs.eyeSync.error, System.Windows.Forms.MessageBoxButtons.YesNoCancel,System.Windows.Forms.MessageBoxIcon.Question);
                if (res == System.Windows.Forms.DialogResult.Yes)
                {
                    return downloadFile(fileOnline, fileOffline);
                }
                else if (res == System.Windows.Forms.DialogResult.No)
                {
                    return uploadFile(fileOffline, fileOnline);
                }
                else
                {
                    return false;
                }
            }
            else if (upload && !download)
            {
                return uploadFile(fileOffline, fileOnline);
            }
            else if (download && !upload)
            {
                return downloadFile(fileOnline, fileOffline);
            }
            return false;
        }

        /// <summary>
        /// Downloads a file to the eyeos-Server
        /// </summary>
        /// <param name="fileOnline">The path, the content should be grabbed from</param>
        /// <param name="fileOffline">The complete path, the file should be saved in</param>
        /// <returns>True, if it works, false, if not</returns>
        public bool downloadFile(string fileOnline, string fileOffline)
        {
            if (!fileExists(fileOnline) || !isFile(fileOnline)) return false;
            try
            {
                string s = loadFile(fileOnline);
                fileOffline = fileOffline.Replace("\\", "/");
                string impact = fileOffline.Substring(0, fileOffline.LastIndexOf('/'));
                bool madedic = true;
                while (!System.IO.Directory.Exists(impact))
                {
                    impact = fileOffline.Substring(0, impact.LastIndexOf('/'));
                    madedic = false;
                }
                while (!madedic)
                {
                    impact = fileOffline.Substring(0, fileOffline.IndexOf('/', impact.Length + 1));
                    System.IO.Directory.CreateDirectory(impact);
                    if (impact == fileOffline.Substring(0, fileOffline.LastIndexOf('/'))) madedic = true;
                }
				System.IO.File.Create(fileOffline).Close();
				System.IO.File.WriteAllBytes(fileOffline,Convert.FromBase64String(s));
                createSyncFile(fileOffline);
                return true;
            }
            catch
            {
                return false;
            }
        }


        /// <summary>
        /// Created a eyeSync-Info-File
        /// </summary>
        /// <param name="filename">The file to create a info file for</param>
        /// <returns>True, if it works, false, if not</returns>
        public bool createSyncFile(string filename)
        {
            try
            {
                System.IO.FileInfo file = new System.IO.FileInfo(filename);
                string syncInfo = file.DirectoryName + "/.eyeSyncInfo__" + file.Name.Replace(".", "__");
                if (System.IO.File.Exists(syncInfo)) System.IO.File.Delete(syncInfo);
                System.IO.File.Copy(filename, syncInfo, true);
                System.IO.FileInfo syncFile = new System.IO.FileInfo(syncInfo);
                syncFile.Attributes = syncFile.Attributes ^ System.IO.FileAttributes.Hidden;
                syncFile.Attributes = syncFile.Attributes ^ System.IO.FileAttributes.NotContentIndexed;
                syncFile.Attributes = syncFile.Attributes ^ System.IO.FileAttributes.System;
                return true;
            }
            catch
            {
                return false;
            }

        }

        /// <summary>
        /// Checks if a file has been changed offline
        /// </summary>
        /// <param name="filename">The file, that should be checked</param>
        /// <returns>true, if it has been changed, false, if not</returns>
        public bool isFileOfflineChanged(string filename)
        {
            System.IO.FileInfo file = new System.IO.FileInfo(filename);
            string syncInfo = file.DirectoryName + "/.eyeSyncInfo__" + file.Name.Replace(".", "__");
            if (!System.IO.File.Exists(syncInfo)) return true;
            string oldfile = System.IO.File.ReadAllText(syncInfo, Encoding.Default);
            string currentfile = System.IO.File.ReadAllText(filename, Encoding.Default);
            if (oldfile != currentfile) return true;
            return false;
        }

        /// <summary>
        /// Checks if a file has been changed offline
        /// </summary>
        /// <param name="fileOffline">The offline file, a eyeSync-Info-FIle has been generated for</param>
        /// <param name="fileOnline">The file, that should be checked</param>
        /// <returns>true, if it has been changed, false, if not</returns>
        public bool isFileOnlineChanged(string fileOffline, string fileOnline)
        {
            System.IO.FileInfo file = new System.IO.FileInfo(fileOffline);
            string syncInfo = file.DirectoryName + "/.eyeSyncInfo__" + file.Name.Replace(".", "__");
            if (!System.IO.File.Exists(syncInfo)) return true;
            string oldfile = System.IO.File.ReadAllText(syncInfo,Encoding.Default);
            string currentfile = loadFile(fileOnline);
            if (oldfile != currentfile) return true;
            return false;
        }


    }
}

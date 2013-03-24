using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace eyeSync
{
    public partial class frm_main : Form
    {

        #region Variables
        eyeOS eye;
        miniNotice mini;
        bool minimized;
        bool forceclose = false;
        #endregion

        #region Creation
        public frm_main(bool minimode)
        {
            InitializeComponent();
            mini = new miniNotice();
            if (minimode)
            {
                minimize();
            }
            if (System.IO.File.Exists(Application.StartupPath + "/config.xml"))
            {
                System.Xml.Serialization.XmlSerializer xser = new System.Xml.Serialization.XmlSerializer(typeof(xConfig));
                System.Xml.XmlReader xrea = System.Xml.XmlReader.Create(Application.StartupPath+ "/config.xml");
                xConfig c = (xConfig)xser.Deserialize(xrea);
                xrea.Close();
                c.ToRealConfig();
            }

            UpdateSyncList();
        }
        private void StartupPeriode()
        {
            working.Visible = true;
            try
            {
                status.Text = eyeSync.langs.eyeSync.connecting_with_server;
                Update();
                eye = new eyeOS();

                status.Text = eyeSync.langs.eyeSync.loading_data;
                Update();
                eye.setCurrentUserDir();

                status.Text = eyeSync.langs.eyeSync.building_local_tree;
                Update();
                tree_local.Nodes.Clear();
                TreeNode node = new TreeNode("/");
                node.Tag = "/";
                tree_local.Nodes.Add(node);
                node.Expand();
                build_local_tree(tree_local.Nodes[0].Tag.ToString(), tree_local.Nodes[0].Nodes);
                tree_local.Nodes[0].Expand();

                status.Text = eyeSync.langs.eyeSync.building_remote_tree;
                Update();
                tree_remote.Nodes.Clear();
                node = new TreeNode(Config.User + "@" + Config.Server);
                node.ImageIndex = 4;
                node.SelectedImageIndex = 4;
                tree_remote.Nodes.Add(node);
                build_remote_tree("", tree_remote.Nodes[0].Nodes);
                tree_remote.Nodes[0].Expand();

            }
            catch (XmlRpc.XmlRpcFaultException)
            {
                MessageBox.Show(langs.eyeSync.error_not_a_user, langs.eyeSync.error, MessageBoxButtons.OK, MessageBoxIcon.Error);
                userPasswordToolStripMenuItem_Click(null, null);
            }
            catch (Exception)
            {
                MessageBox.Show(langs.eyeSync.error_not_eyeOS, langs.eyeSync.error, MessageBoxButtons.OK, MessageBoxIcon.Error);
                serverURLToolStripMenuItem_Click(null, null);
            }
            status.Text = eyeSync.langs.eyeSync.ready;
            working.Visible = false;
        }
        private void frm_main_Shown(object sender, EventArgs e)
        {
            if (minimized && Visible) Visible = false;
            StartupPeriode();
        }
        #endregion

        #region FileTree
        private void build_remote_tree(string main, TreeNodeCollection tree)
        {
            tree.Clear();
            string[] online = eye.getDirContent(main);
            foreach (string file in online)
            {
                TreeNode node = new TreeNode(file);
                if (main == eyeSync.langs.eyeSync.loading)
                {
                    if (eye.isDir(file))
                    {
                        node.Nodes.Add(eyeSync.langs.eyeSync.loading);
                        node.Tag = file;
                        tree.Add(node);
                    }
                }
                else
                {
                    if (eye.isDir(main + "/" + file))
                    {
                        node.Nodes.Add(eyeSync.langs.eyeSync.loading);
                        node.Tag = main + "/" + file;
                        tree.Add(node);
                    }
                }
            }
        }
        private void build_local_tree(string main, TreeNodeCollection tree)
        {
            
            if (main == "")
            {
                foreach (System.IO.DriveInfo drive in System.IO.DriveInfo.GetDrives())
                {
                    if (drive.DriveType == System.IO.DriveType.Fixed)
                        if (drive.IsReady)
                        {
                            TreeNode node = new TreeNode(drive.RootDirectory + " (" + drive.VolumeLabel + ")");
                            node.SelectedImageIndex = 7;
                            node.ImageIndex = 7;
                            node.Tag = drive.RootDirectory;
                            node.Nodes.Add(eyeSync.langs.eyeSync.loading);
                            tree.Add(node);
                        }
                }
            }
            else
            {
                if (main != Environment.GetFolderPath(Environment.SpecialFolder.Desktop)) tree.Clear();
                try
                {
                    foreach (string dir in System.IO.Directory.GetDirectories(main))
                    {
                        TreeNode node = new TreeNode(new System.IO.DirectoryInfo(dir).Name);
                        node.Tag = dir;
                        node.Nodes.Add(eyeSync.langs.eyeSync.loading);
                        node.Name = dir;
                        tree.Add(node);
                    }
                }
                catch (UnauthorizedAccessException uae)
                {
                    foreach (TreeNode node in tree_local.Nodes.Find(main, true))
                    {
                        if (node.Tag.ToString() == main) node.Remove();
                    }
                }
            }
        }
        private void tree_remote_AfterExpand(object sender, TreeViewEventArgs e)
        {
            if (e.Node.Nodes.Count == 1) if (e.Node.Nodes[0].Text == eyeSync.langs.eyeSync.loading)
                {
                    working.Visible = true;
                    status.Text = eyeSync.langs.eyeSync.building_remote_tree;
                    Update();
                    build_remote_tree(e.Node.Tag.ToString(), e.Node.Nodes);
                    working.Visible = false;
                    status.Text = eyeSync.langs.eyeSync.ready;
                }
        }
        private void tree_local_AfterExpand(object sender, TreeViewEventArgs e)
        {
            if (e.Node.Nodes.Count == 1) if (e.Node.Nodes[0].Text == eyeSync.langs.eyeSync.loading)
                {
                    working.Visible = true;
                    status.Text = eyeSync.langs.eyeSync.building_local_tree;
                    Update();
                    build_local_tree(e.Node.Tag.ToString(), e.Node.Nodes);
                    working.Visible = false;
                    status.Text = eyeSync.langs.eyeSync.ready;
                }
        }
        #endregion

        #region TrayHandling
        private void minimize()
        {
            minimized = true;
            Visible = false;
            Opacity = 0;
        }
        private void unminimize()
        {
            minimized = false;
            Opacity = 1;
            Visible = true;
        }
        private void working_VisibleChanged(object sender, EventArgs e)
        {
            if (minimized) mini.Visible = working.Visible;
        }
        private void status_TextChanged(object sender, EventArgs e)
        {
            if (status.Text != eyeSync.langs.eyeSync.ready)
            {
                if (minimized) mini.Visible = true;
                else mini.Visible = false;
                if (minimized) mini.Notice = status.Text;
                if (minimized) mini.Update();
                notifyIcon.Text = "eyeSync - " + status.Text;
            }
            else
            {
                mini.Visible = false;
                notifyIcon.Text = "eyeSync";
            }
        }
        private void notifyIcon_DoubleClick(object sender, EventArgs e)
        {
            unminimize();
        }
        #endregion

        #region SynchronisationList
        private void UpdateSyncList()
        {
            lst_syncs.Items.Clear();
            for (int i = 0; i < Config.Jobs.Count; i++)
			{
                ListViewItem item = new ListViewItem(new string[] { "", Config.Jobs[i].Local, Config.Jobs[i].DirectionReadableShort, Config.Jobs[i].Remote, Config.Jobs[i].TypeReadable });
                item.ImageIndex = 9;
                item.Tag = i;
                lst_syncs.Items.Add(item);
			}
        }
        private void lst_syncs_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (lst_syncs.SelectedItems.Count == 0)
            {
                btn_startsync.Enabled = false;
                btn_delsync.Enabled = false;
            }
            else
            {
                if (Config.Jobs[(int)lst_syncs.SelectedItems[0].Tag].IsManual)
                {
                    bool doit = true;
                    foreach (SyncJob job in Config.Jobs)
                    {
                        if (job.IsActive)
                        {
                            doit = false;
                            break;
                        }
                    }
                    if (doit) btn_startsync.Enabled = true;
                    else btn_startsync.Enabled = false;
                }
                else btn_startsync.Enabled = false;
                btn_delsync.Enabled = true;
            }
        }
        private void btn_startsync_Click(object sender, EventArgs e)
        {
            foreach (SyncJob job in Config.Jobs)
            {
                if (job.IsActive)
                {
                    MessageBox.Show("Only One Active SyncJob!");
                    return;
                }
            }
            Config.Jobs[(int)lst_syncs.SelectedItems[0].Tag].RunJob(lst_syncs.SelectedItems[0], status);
        }
        private void btn_delsync_Click(object sender, EventArgs e)
        {
            Config.Jobs.RemoveAt((int)lst_syncs.SelectedItems[0].Tag);
            UpdateSyncList();
        }
        #endregion

        #region Menu
        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Close();
        }
        private void serverURLToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frm_server server = new frm_server();
            if (server.ShowDialog() == DialogResult.OK)
            {
                if (server.ServerURL != "")
                {
                    Config.Server = server.Server;
                    Config.ServerDir = server.ServerDir;
                    if (MessageBox.Show(langs.eyeSync.update_server_url_info, langs.eyeSync.restart_now, MessageBoxButtons.YesNo, MessageBoxIcon.Question, MessageBoxDefaultButton.Button1) == DialogResult.Yes)
                    {
                        forceclose = true;
                        Application.Restart();
                    }
                }
            }
        }
        private void showEyeSyncToolStripMenuItem_Click(object sender, EventArgs e)
        {
            unminimize();
        }
        private void hideWindowToolStripMenuItem_Click(object sender, EventArgs e)
        {
            minimize();
        }
        private void closeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            forceclose = true;
            Close();
        }
        private void userPasswordToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frm_userpw user = new frm_userpw();
            if (user.ShowDialog() == DialogResult.OK)
            {
                if (user.Password != "" && user.Username != "")
                {
                    Config.User = user.Username;
                    Config.Password = user.Password;
                    StartupPeriode();
                }
            }
        }
        private void aboutEyeSyncToolStripMenuItem_Click(object sender, EventArgs e)
        {
            new frm_about().ShowDialog();
        }
        private void helpToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("http://wiki.eyeos.org/eyeSync"); //Open Wiki
        }
        #endregion

        #region Automatic Jobs
        private void tmr_automatic_Tick(object sender, EventArgs e)
        {
            foreach (SyncJob job in Config.Jobs)
            {
                if (job.IsActive) return;
            }

            for (int i = 0; i < Config.Jobs.Count; i++)
                if (Config.Jobs[i].IsAutomatic)
                    if (Config.Jobs[i].LastRun < DateTime.Now.Subtract(new TimeSpan(0, Config.Jobs[i].UpdateRange, 0)))
                        for (int n = 0; n < lst_syncs.Items.Count; n++)
                            if ((int)lst_syncs.Items[n].Tag == i)
                            {
                                Config.Jobs[i].RunJob(lst_syncs.Items[n], status);
                                return;
                            }


        }
        #endregion

        #region Other FormHandlings
        private void btn_sync_Click(object sender, EventArgs e)
        {
            if (tree_local.SelectedNode != null && tree_remote.SelectedNode != null)
            {
                frm_newsync sync = new frm_newsync(tree_local.SelectedNode.Tag.ToString(), tree_remote.SelectedNode.Tag.ToString());
                if (sync.ShowDialog() == DialogResult.OK)
                {
                    Config.Jobs.Add(sync.GenerateSyncJob());
                    UpdateSyncList();
                }
            }
            else
            {
                MessageBox.Show(langs.eyeSync.error_not_both_selected, langs.eyeSync.error, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        private void frm_main_FormClosed(object sender, FormClosedEventArgs e)
        {
            notifyIcon.Dispose();
        }
        private void frm_main_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason == CloseReason.UserClosing && !minimized && !forceclose)
            {
                minimize();
                e.Cancel = true;
            }
            xConfig c = new xConfig();
            System.Xml.Serialization.XmlSerializer xser = new System.Xml.Serialization.XmlSerializer(typeof(xConfig));
            System.Xml.XmlWriter xwri = System.Xml.XmlWriter.Create(Application.StartupPath + "/config.xml");
            xser.Serialize(xwri, c);
            xwri.Close();
        }
        #endregion


    }
}

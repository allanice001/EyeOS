namespace eyeSync
{
    partial class frm_main
    {
        /// <summary>
        /// Erforderliche Designervariable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Verwendete Ressourcen bereinigen.
        /// </summary>
        /// <param name="disposing">True, wenn verwaltete Ressourcen gelöscht werden sollen; andernfalls False.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Vom Windows Form-Designer generierter Code

        /// <summary>
        /// Erforderliche Methode für die Designerunterstützung.
        /// Der Inhalt der Methode darf nicht mit dem Code-Editor geändert werden.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frm_main));
            this.toolStripContainer1 = new System.Windows.Forms.ToolStripContainer();
            this.strip_status = new System.Windows.Forms.StatusStrip();
            this.status = new System.Windows.Forms.ToolStripStatusLabel();
            this.split_main = new System.Windows.Forms.SplitContainer();
            this.split_loacl_remote = new System.Windows.Forms.SplitContainer();
            this.tree_local = new System.Windows.Forms.TreeView();
            this.imageList = new System.Windows.Forms.ImageList(this.components);
            this.lbl_local = new System.Windows.Forms.Label();
            this.tree_remote = new System.Windows.Forms.TreeView();
            this.lbl_remote = new System.Windows.Forms.Label();
            this.split_actions_synclist = new System.Windows.Forms.SplitContainer();
            this.btn_sync = new System.Windows.Forms.Button();
            this.lst_syncs = new System.Windows.Forms.ListView();
            this.columnHeader1 = new System.Windows.Forms.ColumnHeader("(Keine)");
            this.columnHeader2 = new System.Windows.Forms.ColumnHeader(6);
            this.columnHeader5 = new System.Windows.Forms.ColumnHeader();
            this.columnHeader6 = new System.Windows.Forms.ColumnHeader(4);
            this.columnHeader7 = new System.Windows.Forms.ColumnHeader();
            this.tool_syncs = new System.Windows.Forms.ToolStrip();
            this.btn_startsync = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.btn_delsync = new System.Windows.Forms.ToolStripButton();
            this.strip_menu = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.hideWindowToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem4 = new System.Windows.Forms.ToolStripSeparator();
            this.closeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.optionsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.serverURLToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.userPasswordToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.helpToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.helpToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem2 = new System.Windows.Forms.ToolStripSeparator();
            this.aboutEyeSyncToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.working = new System.Windows.Forms.ToolStripMenuItem();
            this.toolTip = new System.Windows.Forms.ToolTip(this.components);
            this.label_over = new System.Windows.Forms.Label();
            this.notifyIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.notifyIcon_menu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.showEyeSyncToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripSeparator();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.tmr_automatic = new System.Windows.Forms.Timer(this.components);
            this.toolStripContainer1.BottomToolStripPanel.SuspendLayout();
            this.toolStripContainer1.ContentPanel.SuspendLayout();
            this.toolStripContainer1.TopToolStripPanel.SuspendLayout();
            this.toolStripContainer1.SuspendLayout();
            this.strip_status.SuspendLayout();
            this.split_main.Panel1.SuspendLayout();
            this.split_main.Panel2.SuspendLayout();
            this.split_main.SuspendLayout();
            this.split_loacl_remote.Panel1.SuspendLayout();
            this.split_loacl_remote.Panel2.SuspendLayout();
            this.split_loacl_remote.SuspendLayout();
            this.split_actions_synclist.Panel1.SuspendLayout();
            this.split_actions_synclist.Panel2.SuspendLayout();
            this.split_actions_synclist.SuspendLayout();
            this.tool_syncs.SuspendLayout();
            this.strip_menu.SuspendLayout();
            this.notifyIcon_menu.SuspendLayout();
            this.SuspendLayout();
            // 
            // toolStripContainer1
            // 
            // 
            // toolStripContainer1.BottomToolStripPanel
            // 
            this.toolStripContainer1.BottomToolStripPanel.Controls.Add(this.strip_status);
            // 
            // toolStripContainer1.ContentPanel
            // 
            this.toolStripContainer1.ContentPanel.Controls.Add(this.split_main);
            this.toolStripContainer1.ContentPanel.Size = new System.Drawing.Size(792, 520);
            this.toolStripContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.toolStripContainer1.LeftToolStripPanelVisible = false;
            this.toolStripContainer1.Location = new System.Drawing.Point(0, 0);
            this.toolStripContainer1.Name = "toolStripContainer1";
            this.toolStripContainer1.RightToolStripPanelVisible = false;
            this.toolStripContainer1.Size = new System.Drawing.Size(792, 566);
            this.toolStripContainer1.TabIndex = 0;
            // 
            // toolStripContainer1.TopToolStripPanel
            // 
            this.toolStripContainer1.TopToolStripPanel.Controls.Add(this.strip_menu);
            // 
            // strip_status
            // 
            this.strip_status.Dock = System.Windows.Forms.DockStyle.None;
            this.strip_status.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.status});
            this.strip_status.Location = new System.Drawing.Point(0, 0);
            this.strip_status.Name = "strip_status";
            this.strip_status.Size = new System.Drawing.Size(792, 22);
            this.strip_status.TabIndex = 0;
            // 
            // status
            // 
            this.status.Name = "status";
            this.status.Size = new System.Drawing.Size(38, 17);
            this.status.Text = langs.eyeSync.ready;
            this.status.TextChanged += new System.EventHandler(this.status_TextChanged);
            // 
            // split_main
            // 
            this.split_main.BackColor = System.Drawing.Color.Transparent;
            this.split_main.Dock = System.Windows.Forms.DockStyle.Fill;
            this.split_main.FixedPanel = System.Windows.Forms.FixedPanel.Panel2;
            this.split_main.Location = new System.Drawing.Point(0, 0);
            this.split_main.Name = "split_main";
            this.split_main.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // split_main.Panel1
            // 
            this.split_main.Panel1.Controls.Add(this.split_loacl_remote);
            // 
            // split_main.Panel2
            // 
            this.split_main.Panel2.Controls.Add(this.split_actions_synclist);
            this.split_main.Size = new System.Drawing.Size(792, 520);
            this.split_main.SplitterDistance = 312;
            this.split_main.SplitterWidth = 1;
            this.split_main.TabIndex = 0;
            // 
            // split_loacl_remote
            // 
            this.split_loacl_remote.Dock = System.Windows.Forms.DockStyle.Fill;
            this.split_loacl_remote.IsSplitterFixed = true;
            this.split_loacl_remote.Location = new System.Drawing.Point(0, 0);
            this.split_loacl_remote.Name = "split_loacl_remote";
            // 
            // split_loacl_remote.Panel1
            // 
            this.split_loacl_remote.Panel1.Controls.Add(this.tree_local);
            this.split_loacl_remote.Panel1.Controls.Add(this.lbl_local);
            this.split_loacl_remote.Panel1.RightToLeft = System.Windows.Forms.RightToLeft.No;
            // 
            // split_loacl_remote.Panel2
            // 
            this.split_loacl_remote.Panel2.Controls.Add(this.tree_remote);
            this.split_loacl_remote.Panel2.Controls.Add(this.lbl_remote);
            this.split_loacl_remote.Panel2.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.split_loacl_remote.Size = new System.Drawing.Size(792, 312);
            this.split_loacl_remote.SplitterDistance = 394;
            this.split_loacl_remote.SplitterWidth = 1;
            this.split_loacl_remote.TabIndex = 0;
            // 
            // tree_local
            // 
            this.tree_local.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tree_local.HideSelection = false;
            this.tree_local.ImageIndex = 2;
            this.tree_local.ImageList = this.imageList;
            this.tree_local.Location = new System.Drawing.Point(3, 23);
            this.tree_local.Name = "tree_local";
            this.tree_local.SelectedImageIndex = 3;
            this.tree_local.Size = new System.Drawing.Size(388, 285);
            this.tree_local.TabIndex = 1;
            this.tree_local.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.tree_local_AfterExpand);
            this.tree_local.AfterExpand += new System.Windows.Forms.TreeViewEventHandler(this.tree_local_AfterExpand);
            // 
            // imageList
            // 
            this.imageList.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList.ImageStream")));
            this.imageList.TransparentColor = System.Drawing.Color.Black;
            this.imageList.Images.SetKeyName(0, "Folder 001-16.png");
            this.imageList.Images.SetKeyName(1, "Folder 003-16.png");
            this.imageList.Images.SetKeyName(2, "folder.gif");
            this.imageList.Images.SetKeyName(3, "folder_open.gif");
            this.imageList.Images.SetKeyName(4, "eyeOS_white.ico");
            this.imageList.Images.SetKeyName(5, "desktop.png");
            this.imageList.Images.SetKeyName(6, "arb.png");
            this.imageList.Images.SetKeyName(7, "hd.png");
            this.imageList.Images.SetKeyName(8, "sync_active.png");
            this.imageList.Images.SetKeyName(9, "sync_inactive.png");
            this.imageList.Images.SetKeyName(10, "sync_active_2.png");
            // 
            // lbl_local
            // 
            this.lbl_local.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.lbl_local.Location = new System.Drawing.Point(3, 2);
            this.lbl_local.Name = "lbl_local";
            this.lbl_local.Size = new System.Drawing.Size(388, 20);
            this.lbl_local.TabIndex = 0;
            this.lbl_local.Text = langs.eyeSync.local+":";
            this.lbl_local.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // tree_remote
            // 
            this.tree_remote.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tree_remote.HideSelection = false;
            this.tree_remote.ImageIndex = 2;
            this.tree_remote.ImageList = this.imageList;
            this.tree_remote.Location = new System.Drawing.Point(3, 23);
            this.tree_remote.Name = "tree_remote";
            this.tree_remote.SelectedImageIndex = 3;
            this.tree_remote.Size = new System.Drawing.Size(391, 285);
            this.tree_remote.TabIndex = 2;
            this.tree_remote.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.tree_remote_AfterExpand);
            this.tree_remote.AfterExpand += new System.Windows.Forms.TreeViewEventHandler(this.tree_remote_AfterExpand);
            // 
            // lbl_remote
            // 
            this.lbl_remote.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.lbl_remote.Location = new System.Drawing.Point(6, 2);
            this.lbl_remote.Name = "lbl_remote";
            this.lbl_remote.Size = new System.Drawing.Size(388, 20);
            this.lbl_remote.TabIndex = 1;
            this.lbl_remote.Text = langs.eyeSync.remote + ":";
            this.lbl_remote.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // split_actions_synclist
            // 
            this.split_actions_synclist.Dock = System.Windows.Forms.DockStyle.Fill;
            this.split_actions_synclist.FixedPanel = System.Windows.Forms.FixedPanel.Panel1;
            this.split_actions_synclist.Location = new System.Drawing.Point(0, 0);
            this.split_actions_synclist.Name = "split_actions_synclist";
            this.split_actions_synclist.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // split_actions_synclist.Panel1
            // 
            this.split_actions_synclist.Panel1.Controls.Add(this.btn_sync);
            // 
            // split_actions_synclist.Panel2
            // 
            this.split_actions_synclist.Panel2.Controls.Add(this.lst_syncs);
            this.split_actions_synclist.Panel2.Controls.Add(this.tool_syncs);
            this.split_actions_synclist.Size = new System.Drawing.Size(792, 207);
            this.split_actions_synclist.SplitterDistance = 27;
            this.split_actions_synclist.SplitterWidth = 1;
            this.split_actions_synclist.TabIndex = 0;
            // 
            // btn_sync
            // 
            this.btn_sync.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.btn_sync.Location = new System.Drawing.Point(343, 1);
            this.btn_sync.Name = "btn_sync";
            this.btn_sync.Size = new System.Drawing.Size(102, 23);
            this.btn_sync.TabIndex = 2;
            this.btn_sync.Text = global::eyeSync.langs.eyeSync.synchronize;
            this.toolTip.SetToolTip(this.btn_sync, global::eyeSync.langs.eyeSync.synchronize_desc);
            this.btn_sync.UseVisualStyleBackColor = true;
            this.btn_sync.Click += new System.EventHandler(this.btn_sync_Click);
            // 
            // lst_syncs
            // 
            this.lst_syncs.BackColor = System.Drawing.SystemColors.Window;
            this.lst_syncs.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader1,
            this.columnHeader2,
            this.columnHeader5,
            this.columnHeader6,
            this.columnHeader7});
            this.lst_syncs.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lst_syncs.FullRowSelect = true;
            this.lst_syncs.HideSelection = false;
            this.lst_syncs.Location = new System.Drawing.Point(0, 25);
            this.lst_syncs.MultiSelect = false;
            this.lst_syncs.Name = "lst_syncs";
            this.lst_syncs.ShowGroups = false;
            this.lst_syncs.ShowItemToolTips = true;
            this.lst_syncs.Size = new System.Drawing.Size(792, 154);
            this.lst_syncs.SmallImageList = this.imageList;
            this.lst_syncs.Sorting = System.Windows.Forms.SortOrder.Ascending;
            this.lst_syncs.TabIndex = 1;
            this.lst_syncs.UseCompatibleStateImageBehavior = false;
            this.lst_syncs.View = System.Windows.Forms.View.Details;
            this.lst_syncs.SelectedIndexChanged += new System.EventHandler(this.lst_syncs_SelectedIndexChanged);
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "";
            this.columnHeader1.Width = 20;
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = global::eyeSync.langs.eyeSync.local;
            this.columnHeader2.Width = 400;
            // 
            // columnHeader5
            // 
            this.columnHeader5.Text = "";
            this.columnHeader5.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader5.Width = 40;
            // 
            // columnHeader6
            // 
            this.columnHeader6.Text = global::eyeSync.langs.eyeSync.remote;
            this.columnHeader6.Width = 250;
            // 
            // columnHeader7
            // 
            this.columnHeader7.Text = global::eyeSync.langs.eyeSync.type;
            this.columnHeader7.Width = 70;
            // 
            // tool_syncs
            // 
            this.tool_syncs.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.btn_startsync,
            this.toolStripSeparator1,
            this.btn_delsync});
            this.tool_syncs.Location = new System.Drawing.Point(0, 0);
            this.tool_syncs.Name = "tool_syncs";
            this.tool_syncs.Size = new System.Drawing.Size(792, 25);
            this.tool_syncs.TabIndex = 0;
            // 
            // btn_startsync
            // 
            this.btn_startsync.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btn_startsync.Enabled = false;
            this.btn_startsync.Image = ((System.Drawing.Image)(resources.GetObject("btn_startsync.Image")));
            this.btn_startsync.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btn_startsync.Name = "btn_startsync";
            this.btn_startsync.Size = new System.Drawing.Size(23, 22);
            this.btn_startsync.Text = langs.eyeSync.RunJob;
            this.btn_startsync.Click += new System.EventHandler(this.btn_startsync_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(6, 25);
            // 
            // btn_delsync
            // 
            this.btn_delsync.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btn_delsync.Enabled = false;
            this.btn_delsync.Image = global::eyeSync.Properties.Resources.delsync;
            this.btn_delsync.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btn_delsync.Name = "btn_delsync";
            this.btn_delsync.Size = new System.Drawing.Size(23, 22);
            this.btn_delsync.Text = langs.eyeSync.DeleteJob;
            this.btn_delsync.Click += new System.EventHandler(this.btn_delsync_Click);
            // 
            // strip_menu
            // 
            this.strip_menu.Dock = System.Windows.Forms.DockStyle.None;
            this.strip_menu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.optionsToolStripMenuItem,
            this.helpToolStripMenuItem,
            this.working});
            this.strip_menu.Location = new System.Drawing.Point(0, 0);
            this.strip_menu.Name = "strip_menu";
            this.strip_menu.Size = new System.Drawing.Size(792, 24);
            this.strip_menu.TabIndex = 0;
            this.strip_menu.Text = "Menu";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.hideWindowToolStripMenuItem,
            this.toolStripMenuItem4,
            this.closeToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(35, 20);
            this.fileToolStripMenuItem.Text = langs.eyeSync.file;
            // 
            // hideWindowToolStripMenuItem
            // 
            this.hideWindowToolStripMenuItem.Name = "hideWindowToolStripMenuItem";
            this.hideWindowToolStripMenuItem.Size = new System.Drawing.Size(151, 22);
            this.hideWindowToolStripMenuItem.Text = langs.eyeSync.hide_eyeSync;
            this.hideWindowToolStripMenuItem.Click += new System.EventHandler(this.hideWindowToolStripMenuItem_Click);
            // 
            // toolStripMenuItem4
            // 
            this.toolStripMenuItem4.Name = "toolStripMenuItem4";
            this.toolStripMenuItem4.Size = new System.Drawing.Size(148, 6);
            // 
            // closeToolStripMenuItem
            // 
            this.closeToolStripMenuItem.Name = "closeToolStripMenuItem";
            this.closeToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.F4)));
            this.closeToolStripMenuItem.Size = new System.Drawing.Size(151, 22);
            this.closeToolStripMenuItem.Text = langs.eyeSync.close;
            this.closeToolStripMenuItem.ToolTipText = langs.eyeSync.close_desc;
            this.closeToolStripMenuItem.Click += new System.EventHandler(this.closeToolStripMenuItem_Click);
            // 
            // optionsToolStripMenuItem
            // 
            this.optionsToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.serverURLToolStripMenuItem,
            this.userPasswordToolStripMenuItem});
            this.optionsToolStripMenuItem.Name = "optionsToolStripMenuItem";
            this.optionsToolStripMenuItem.Size = new System.Drawing.Size(56, 20);
            this.optionsToolStripMenuItem.Text = langs.eyeSync.options;
            // 
            // serverURLToolStripMenuItem
            // 
            this.serverURLToolStripMenuItem.Name = "serverURLToolStripMenuItem";
            this.serverURLToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.S)));
            this.serverURLToolStripMenuItem.Size = new System.Drawing.Size(205, 22);
            this.serverURLToolStripMenuItem.Text = global::eyeSync.langs.eyeSync.server_url;
            this.serverURLToolStripMenuItem.ToolTipText = global::eyeSync.langs.eyeSync.server_url_desc;
            this.serverURLToolStripMenuItem.Click += new System.EventHandler(this.serverURLToolStripMenuItem_Click);
            // 
            // userPasswordToolStripMenuItem
            // 
            this.userPasswordToolStripMenuItem.Name = "userPasswordToolStripMenuItem";
            this.userPasswordToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.U)));
            this.userPasswordToolStripMenuItem.Size = new System.Drawing.Size(205, 22);
            this.userPasswordToolStripMenuItem.Text = langs.eyeSync.user_password;
            this.userPasswordToolStripMenuItem.ToolTipText = langs.eyeSync.user_password_desc;
            this.userPasswordToolStripMenuItem.Click += new System.EventHandler(this.userPasswordToolStripMenuItem_Click);
            // 
            // helpToolStripMenuItem
            // 
            this.helpToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.helpToolStripMenuItem1,
            this.toolStripMenuItem2,
            this.aboutEyeSyncToolStripMenuItem});
            this.helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            this.helpToolStripMenuItem.Size = new System.Drawing.Size(40, 20);
            this.helpToolStripMenuItem.Text = langs.eyeSync.help;
            // 
            // helpToolStripMenuItem1
            // 
            this.helpToolStripMenuItem1.Name = "helpToolStripMenuItem1";
            this.helpToolStripMenuItem1.ShortcutKeys = System.Windows.Forms.Keys.F1;
            this.helpToolStripMenuItem1.Size = new System.Drawing.Size(158, 22);
            this.helpToolStripMenuItem1.Text = langs.eyeSync.help;
            this.helpToolStripMenuItem1.Click += new System.EventHandler(this.helpToolStripMenuItem1_Click);
            // 
            // toolStripMenuItem2
            // 
            this.toolStripMenuItem2.Name = "toolStripMenuItem2";
            this.toolStripMenuItem2.Size = new System.Drawing.Size(155, 6);
            // 
            // aboutEyeSyncToolStripMenuItem
            // 
            this.aboutEyeSyncToolStripMenuItem.Name = "aboutEyeSyncToolStripMenuItem";
            this.aboutEyeSyncToolStripMenuItem.Size = new System.Drawing.Size(158, 22);
            this.aboutEyeSyncToolStripMenuItem.Text = langs.eyeSync.about;
            this.aboutEyeSyncToolStripMenuItem.ToolTipText = langs.eyeSync.about_desc;
            this.aboutEyeSyncToolStripMenuItem.Click += new System.EventHandler(this.aboutEyeSyncToolStripMenuItem_Click);
            // 
            // working
            // 
            this.working.Alignment = System.Windows.Forms.ToolStripItemAlignment.Right;
            this.working.Image = global::eyeSync.Properties.Resources.mini;
            this.working.Name = "working";
            this.working.Size = new System.Drawing.Size(89, 20);
            this.working.Text = langs.eyeSync.working;
            this.working.TextImageRelation = System.Windows.Forms.TextImageRelation.TextBeforeImage;
            this.working.Visible = false;
            this.working.VisibleChanged += new System.EventHandler(this.working_VisibleChanged);
            // 
            // label_over
            // 
            this.label_over.Location = new System.Drawing.Point(0, 0);
            this.label_over.Name = "label_over";
            this.label_over.Size = new System.Drawing.Size(100, 23);
            this.label_over.TabIndex = 0;
            // 
            // notifyIcon
            // 
            this.notifyIcon.ContextMenuStrip = this.notifyIcon_menu;
            this.notifyIcon.Icon = ((System.Drawing.Icon)(resources.GetObject("notifyIcon.Icon")));
            this.notifyIcon.Text = "eyeSync";
            this.notifyIcon.Visible = true;
            this.notifyIcon.DoubleClick += new System.EventHandler(this.notifyIcon_DoubleClick);
            // 
            // notifyIcon_menu
            // 
            this.notifyIcon_menu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.showEyeSyncToolStripMenuItem,
            this.toolStripMenuItem1,
            this.exitToolStripMenuItem});
            this.notifyIcon_menu.Name = "notifyIcon_menu";
            this.notifyIcon_menu.Size = new System.Drawing.Size(156, 54);
            // 
            // showEyeSyncToolStripMenuItem
            // 
            this.showEyeSyncToolStripMenuItem.Name = "showEyeSyncToolStripMenuItem";
            this.showEyeSyncToolStripMenuItem.Size = new System.Drawing.Size(155, 22);
            this.showEyeSyncToolStripMenuItem.Text = langs.eyeSync.show_eyeSync;
            this.showEyeSyncToolStripMenuItem.Click += new System.EventHandler(this.showEyeSyncToolStripMenuItem_Click);
            // 
            // toolStripMenuItem1
            // 
            this.toolStripMenuItem1.Name = "toolStripMenuItem1";
            this.toolStripMenuItem1.Size = new System.Drawing.Size(152, 6);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(155, 22);
            this.exitToolStripMenuItem.Text = langs.eyeSync.close;
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // tmr_automatic
            // 
            this.tmr_automatic.Enabled = true;
            this.tmr_automatic.Interval = 60000;
            this.tmr_automatic.Tick += new System.EventHandler(this.tmr_automatic_Tick);
            // 
            // frm_main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(792, 566);
            this.Controls.Add(this.toolStripContainer1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.strip_menu;
            this.Name = "frm_main";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "eyeSync";
            this.Shown += new System.EventHandler(this.frm_main_Shown);
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.frm_main_FormClosed);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.frm_main_FormClosing);
            this.toolStripContainer1.BottomToolStripPanel.ResumeLayout(false);
            this.toolStripContainer1.BottomToolStripPanel.PerformLayout();
            this.toolStripContainer1.ContentPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.ResumeLayout(false);
            this.toolStripContainer1.TopToolStripPanel.PerformLayout();
            this.toolStripContainer1.ResumeLayout(false);
            this.toolStripContainer1.PerformLayout();
            this.strip_status.ResumeLayout(false);
            this.strip_status.PerformLayout();
            this.split_main.Panel1.ResumeLayout(false);
            this.split_main.Panel2.ResumeLayout(false);
            this.split_main.ResumeLayout(false);
            this.split_loacl_remote.Panel1.ResumeLayout(false);
            this.split_loacl_remote.Panel2.ResumeLayout(false);
            this.split_loacl_remote.ResumeLayout(false);
            this.split_actions_synclist.Panel1.ResumeLayout(false);
            this.split_actions_synclist.Panel2.ResumeLayout(false);
            this.split_actions_synclist.Panel2.PerformLayout();
            this.split_actions_synclist.ResumeLayout(false);
            this.tool_syncs.ResumeLayout(false);
            this.tool_syncs.PerformLayout();
            this.strip_menu.ResumeLayout(false);
            this.strip_menu.PerformLayout();
            this.notifyIcon_menu.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ToolStripContainer toolStripContainer1;
        private System.Windows.Forms.StatusStrip strip_status;
        private System.Windows.Forms.MenuStrip strip_menu;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem closeToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem optionsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem helpToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem2;
        private System.Windows.Forms.ToolStripMenuItem aboutEyeSyncToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem serverURLToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem userPasswordToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem helpToolStripMenuItem1;
        private System.Windows.Forms.SplitContainer split_main;
        private System.Windows.Forms.SplitContainer split_loacl_remote;
        private System.Windows.Forms.SplitContainer split_actions_synclist;
        private System.Windows.Forms.Label lbl_local;
        private System.Windows.Forms.Label lbl_remote;
        private System.Windows.Forms.TreeView tree_local;
        private System.Windows.Forms.TreeView tree_remote;
        private System.Windows.Forms.Button btn_sync;
        private System.Windows.Forms.ToolTip toolTip;
        private System.Windows.Forms.ImageList imageList;
        private System.Windows.Forms.ToolStrip tool_syncs;
        private System.Windows.Forms.ListView lst_syncs;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.ColumnHeader columnHeader5;
        private System.Windows.Forms.ColumnHeader columnHeader6;
        private System.Windows.Forms.ColumnHeader columnHeader7;
        private System.Windows.Forms.ToolStripStatusLabel status;
        private System.Windows.Forms.ToolStripButton btn_startsync;
        private System.Windows.Forms.ToolStripMenuItem working;
        private System.Windows.Forms.Label label_over;
        private System.Windows.Forms.NotifyIcon notifyIcon;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripMenuItem hideWindowToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem4;
        private System.Windows.Forms.ContextMenuStrip notifyIcon_menu;
        private System.Windows.Forms.ToolStripMenuItem showEyeSyncToolStripMenuItem;
        private System.Windows.Forms.ToolStripSeparator toolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.Timer tmr_automatic;
        private System.Windows.Forms.ToolStripButton btn_delsync;

    }
}


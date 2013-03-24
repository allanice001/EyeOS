namespace eyeSync
{
    partial class frm_server
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.pic_logo = new System.Windows.Forms.PictureBox();
            this.lbl_server = new System.Windows.Forms.Label();
            this.lbl_slash = new System.Windows.Forms.Label();
            this.lbl_linkURL = new System.Windows.Forms.LinkLabel();
            this.lbl_url = new System.Windows.Forms.Label();
            this.btn_save = new System.Windows.Forms.Button();
            this.btn_cancel = new System.Windows.Forms.Button();
            this.chk_public_server = new System.Windows.Forms.CheckBox();
            this.txt_subdir = new eyeSync.SelfInstructingTextBox();
            this.txt_server = new eyeSync.SelfInstructingTextBox();
            this.cbo_secure = new System.Windows.Forms.ComboBox();
            ((System.ComponentModel.ISupportInitialize)(this.pic_logo)).BeginInit();
            this.SuspendLayout();
            // 
            // pic_logo
            // 
            this.pic_logo.Image = global::eyeSync.Properties.Resources.eyesync;
            this.pic_logo.Location = new System.Drawing.Point(12, 12);
            this.pic_logo.Name = "pic_logo";
            this.pic_logo.Size = new System.Drawing.Size(32, 32);
            this.pic_logo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.AutoSize;
            this.pic_logo.TabIndex = 0;
            this.pic_logo.TabStop = false;
            // 
            // lbl_server
            // 
            this.lbl_server.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lbl_server.Location = new System.Drawing.Point(53, 12);
            this.lbl_server.Name = "lbl_server";
            this.lbl_server.Size = new System.Drawing.Size(320, 32);
            this.lbl_server.TabIndex = 1;
            this.lbl_server.Text = langs.eyeSync.server_url;
            this.lbl_server.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // lbl_slash
            // 
            this.lbl_slash.AutoSize = true;
            this.lbl_slash.Location = new System.Drawing.Point(243, 59);
            this.lbl_slash.Name = "lbl_slash";
            this.lbl_slash.Size = new System.Drawing.Size(12, 13);
            this.lbl_slash.TabIndex = 4;
            this.lbl_slash.Text = "/";
            // 
            // lbl_linkURL
            // 
            this.lbl_linkURL.AutoEllipsis = true;
            this.lbl_linkURL.Location = new System.Drawing.Point(53, 89);
            this.lbl_linkURL.Name = "lbl_linkURL";
            this.lbl_linkURL.Size = new System.Drawing.Size(317, 13);
            this.lbl_linkURL.TabIndex = 6;
            this.lbl_linkURL.TabStop = true;
            this.lbl_linkURL.Text = "http://www.eyeos.info/";
            // 
            // lbl_url
            // 
            this.lbl_url.AutoSize = true;
            this.lbl_url.Location = new System.Drawing.Point(12, 89);
            this.lbl_url.Name = "lbl_url";
            this.lbl_url.Size = new System.Drawing.Size(32, 13);
            this.lbl_url.TabIndex = 7;
            this.lbl_url.Text = eyeSync.langs.eyeSync.url+":";
            // 
            // btn_save
            // 
            this.btn_save.Location = new System.Drawing.Point(261, 123);
            this.btn_save.Name = "btn_save";
            this.btn_save.Size = new System.Drawing.Size(109, 23);
            this.btn_save.TabIndex = 8;
            this.btn_save.Text = global::eyeSync.langs.eyeSync.save_server_url;
            this.btn_save.UseVisualStyleBackColor = true;
            this.btn_save.Click += new System.EventHandler(this.btn_save_Click);
            // 
            // btn_cancel
            // 
            this.btn_cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btn_cancel.Location = new System.Drawing.Point(180, 123);
            this.btn_cancel.Name = "btn_cancel";
            this.btn_cancel.Size = new System.Drawing.Size(75, 23);
            this.btn_cancel.TabIndex = 9;
            this.btn_cancel.Text = global::eyeSync.langs.eyeSync.cancel;
            this.btn_cancel.UseVisualStyleBackColor = true;
            this.btn_cancel.Click += new System.EventHandler(this.btn_cancel_Click);
            // 
            // chk_public_server
            // 
            this.chk_public_server.AutoSize = true;
            this.chk_public_server.Location = new System.Drawing.Point(12, 127);
            this.chk_public_server.Name = "chk_public_server";
            this.chk_public_server.Size = new System.Drawing.Size(146, 17);
            this.chk_public_server.TabIndex = 10;
            this.chk_public_server.Text = global::eyeSync.langs.eyeSync.use_public_server;
            this.chk_public_server.UseVisualStyleBackColor = true;
            this.chk_public_server.CheckedChanged += new System.EventHandler(this.chk_public_server_CheckedChanged);
            // 
            // txt_subdir
            // 
            this.txt_subdir.ForeColor = System.Drawing.SystemColors.GrayText;
            this.txt_subdir.InstructionText = global::eyeSync.langs.eyeSync.subdir_instruction;
            this.txt_subdir.Location = new System.Drawing.Point(261, 56);
            this.txt_subdir.Name = "txt_subdir";
            this.txt_subdir.Size = new System.Drawing.Size(109, 20);
            this.txt_subdir.TabIndex = 5;
            this.txt_subdir.Text = Config.ServerDir;
            this.txt_subdir.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // txt_server
            // 
            this.txt_server.ForeColor = System.Drawing.SystemColors.GrayText;
            this.txt_server.InstructionText = global::eyeSync.langs.eyeSync.server_instruction;
            this.txt_server.Location = new System.Drawing.Point(79, 56);
            this.txt_server.Name = "txt_server";
            this.txt_server.Size = new System.Drawing.Size(158, 20);
            this.txt_server.TabIndex = 3;
            this.txt_server.Text = Config.Server;
            this.txt_server.TextChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // cbo_secure
            // 
            this.cbo_secure.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbo_secure.FormattingEnabled = true;
            this.cbo_secure.Items.AddRange(new object[] {
            "http://",
            "https://"});
            this.cbo_secure.Location = new System.Drawing.Point(12, 56);
            this.cbo_secure.Name = "cbo_secure";
            this.cbo_secure.Size = new System.Drawing.Size(61, 21);
            this.cbo_secure.TabIndex = 11;
            this.cbo_secure.SelectedIndexChanged += new System.EventHandler(this.txt_TextChanged);
            // 
            // frm_server
            // 
            this.AcceptButton = this.btn_save;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.btn_cancel;
            this.ClientSize = new System.Drawing.Size(382, 160);
            this.Controls.Add(this.cbo_secure);
            this.Controls.Add(this.chk_public_server);
            this.Controls.Add(this.btn_cancel);
            this.Controls.Add(this.btn_save);
            this.Controls.Add(this.lbl_url);
            this.Controls.Add(this.lbl_linkURL);
            this.Controls.Add(this.txt_subdir);
            this.Controls.Add(this.lbl_slash);
            this.Controls.Add(this.txt_server);
            this.Controls.Add(this.pic_logo);
            this.Controls.Add(this.lbl_server);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frm_server";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = langs.eyeSync.server_url;
            ((System.ComponentModel.ISupportInitialize)(this.pic_logo)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }
        #endregion

        private System.Windows.Forms.PictureBox pic_logo;
        private System.Windows.Forms.Label lbl_server;
        private SelfInstructingTextBox txt_server;
        private System.Windows.Forms.Label lbl_slash;
        private SelfInstructingTextBox txt_subdir;
        private System.Windows.Forms.LinkLabel lbl_linkURL;
        private System.Windows.Forms.Label lbl_url;
        private System.Windows.Forms.Button btn_save;
        private System.Windows.Forms.Button btn_cancel;
        private System.Windows.Forms.CheckBox chk_public_server;
        private System.Windows.Forms.ComboBox cbo_secure;
    }
}
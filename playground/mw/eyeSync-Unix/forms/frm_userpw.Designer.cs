namespace eyeSync
{
    partial class frm_userpw
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
            this.lbl_userpw = new System.Windows.Forms.Label();
            this.lbl_username = new System.Windows.Forms.Label();
            this.lbl_pass = new System.Windows.Forms.Label();
            this.txt_pass = new System.Windows.Forms.TextBox();
            this.txt_username = new System.Windows.Forms.TextBox();
            this.btn_login = new System.Windows.Forms.Button();
            this.btn_cancel = new System.Windows.Forms.Button();
            this.lbl_serverlink = new System.Windows.Forms.LinkLabel();
            this.lbl_server = new System.Windows.Forms.Label();
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
            this.pic_logo.TabIndex = 2;
            this.pic_logo.TabStop = false;
            // 
            // lbl_userpw
            // 
            this.lbl_userpw.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lbl_userpw.Location = new System.Drawing.Point(53, 12);
            this.lbl_userpw.Name = "lbl_userpw";
            this.lbl_userpw.Size = new System.Drawing.Size(224, 32);
            this.lbl_userpw.TabIndex = 3;
            this.lbl_userpw.Text = langs.eyeSync.user_password;
            this.lbl_userpw.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // lbl_username
            // 
            this.lbl_username.AutoSize = true;
            this.lbl_username.Location = new System.Drawing.Point(12, 80);
            this.lbl_username.Name = "lbl_username";
            this.lbl_username.Size = new System.Drawing.Size(58, 13);
            this.lbl_username.TabIndex = 4;
            this.lbl_username.Text = langs.eyeSync.username + ":";
            // 
            // lbl_pass
            // 
            this.lbl_pass.AutoSize = true;
            this.lbl_pass.Location = new System.Drawing.Point(12, 106);
            this.lbl_pass.Name = "lbl_pass";
            this.lbl_pass.Size = new System.Drawing.Size(56, 13);
            this.lbl_pass.TabIndex = 5;
            this.lbl_pass.Text = langs.eyeSync.password+":";
            // 
            // txt_pass
            // 
            this.txt_pass.Location = new System.Drawing.Point(106, 103);
            this.txt_pass.Name = "txt_pass";
            this.txt_pass.Size = new System.Drawing.Size(171, 20);
            this.txt_pass.TabIndex = 6;
            this.txt_pass.UseSystemPasswordChar = true;
            this.txt_pass.Text = Config.Password;
            // 
            // txt_username
            // 
            this.txt_username.Location = new System.Drawing.Point(106, 77);
            this.txt_username.Name = "txt_username";
            this.txt_username.Size = new System.Drawing.Size(171, 20);
            this.txt_username.TabIndex = 0;
            this.txt_username.Text = Config.User;
            // 
            // btn_login
            // 
            this.btn_login.Location = new System.Drawing.Point(202, 129);
            this.btn_login.Name = "btn_login";
            this.btn_login.Size = new System.Drawing.Size(75, 23);
            this.btn_login.TabIndex = 8;
            this.btn_login.Text = langs.eyeSync.login;
            this.btn_login.UseVisualStyleBackColor = true;
            this.btn_login.Click += new System.EventHandler(this.btn_login_Click);
            // 
            // btn_cancel
            // 
            this.btn_cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btn_cancel.Location = new System.Drawing.Point(121, 129);
            this.btn_cancel.Name = "btn_cancel";
            this.btn_cancel.Size = new System.Drawing.Size(75, 23);
            this.btn_cancel.TabIndex = 9;
            this.btn_cancel.Text = langs.eyeSync.cancel;
            this.btn_cancel.UseVisualStyleBackColor = true;
            this.btn_cancel.Click += new System.EventHandler(this.btn_cancel_Click);
            // 
            // lbl_serverlink
            // 
            this.lbl_serverlink.AutoSize = true;
            this.lbl_serverlink.Location = new System.Drawing.Point(103, 56);
            this.lbl_serverlink.Name = "lbl_serverlink";
            this.lbl_serverlink.Size = new System.Drawing.Size(38, 13);
            this.lbl_serverlink.TabIndex = 10;
            this.lbl_serverlink.TabStop = true;
            this.lbl_serverlink.Text = "http://";
            // 
            // lbl_server
            // 
            this.lbl_server.AutoSize = true;
            this.lbl_server.Location = new System.Drawing.Point(12, 56);
            this.lbl_server.Name = "lbl_server";
            this.lbl_server.Size = new System.Drawing.Size(41, 13);
            this.lbl_server.TabIndex = 11;
            this.lbl_server.Text = langs.eyeSync.server+":";
            // 
            // frm_userpw
            // 
            this.AcceptButton = this.btn_login;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.btn_cancel;
            this.ClientSize = new System.Drawing.Size(289, 167);
            this.Controls.Add(this.lbl_server);
            this.Controls.Add(this.lbl_serverlink);
            this.Controls.Add(this.btn_cancel);
            this.Controls.Add(this.btn_login);
            this.Controls.Add(this.txt_username);
            this.Controls.Add(this.txt_pass);
            this.Controls.Add(this.lbl_pass);
            this.Controls.Add(this.lbl_username);
            this.Controls.Add(this.pic_logo);
            this.Controls.Add(this.lbl_userpw);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frm_userpw";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = langs.eyeSync.user_password;
            ((System.ComponentModel.ISupportInitialize)(this.pic_logo)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pic_logo;
        private System.Windows.Forms.Label lbl_userpw;
        private System.Windows.Forms.Label lbl_username;
        private System.Windows.Forms.Label lbl_pass;
        private System.Windows.Forms.TextBox txt_pass;
        private System.Windows.Forms.TextBox txt_username;
        private System.Windows.Forms.Button btn_login;
        private System.Windows.Forms.Button btn_cancel;
        private System.Windows.Forms.LinkLabel lbl_serverlink;
        private System.Windows.Forms.Label lbl_server;
    }
}
namespace eyeSync
{
    partial class frm_newsync
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
            this.lbl_sync = new System.Windows.Forms.Label();
            this.lbl_local = new System.Windows.Forms.Label();
            this.lbl_with = new System.Windows.Forms.Label();
            this.lbl_remote = new System.Windows.Forms.Label();
            this.lbl_direction = new System.Windows.Forms.Label();
            this.cbo_direction = new System.Windows.Forms.ComboBox();
            this.cbo_type = new System.Windows.Forms.ComboBox();
            this.lbl_type = new System.Windows.Forms.Label();
            this.lbl_updaterange = new System.Windows.Forms.Label();
            this.cbo_updaterange = new System.Windows.Forms.ComboBox();
            this.btn_create = new System.Windows.Forms.Button();
            this.btn_cancel = new System.Windows.Forms.Button();
            this.chk_recursive = new System.Windows.Forms.CheckBox();
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
            // lbl_sync
            // 
            this.lbl_sync.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lbl_sync.Location = new System.Drawing.Point(50, 12);
            this.lbl_sync.Name = "lbl_sync";
            this.lbl_sync.Size = new System.Drawing.Size(239, 32);
            this.lbl_sync.TabIndex = 1;
            this.lbl_sync.Text = global::eyeSync.langs.eyeSync.synchronize;
            this.lbl_sync.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // lbl_local
            // 
            this.lbl_local.AutoEllipsis = true;
            this.lbl_local.Location = new System.Drawing.Point(12, 47);
            this.lbl_local.Name = "lbl_local";
            this.lbl_local.Size = new System.Drawing.Size(350, 30);
            this.lbl_local.TabIndex = 2;
            this.lbl_local.Text = "[local]";
            this.lbl_local.TextAlign = System.Drawing.ContentAlignment.BottomLeft;
            // 
            // lbl_with
            // 
            this.lbl_with.Location = new System.Drawing.Point(12, 77);
            this.lbl_with.Name = "lbl_with";
            this.lbl_with.Size = new System.Drawing.Size(350, 15);
            this.lbl_with.TabIndex = 3;
            this.lbl_with.Text = global::eyeSync.langs.eyeSync.with;
            this.lbl_with.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_remote
            // 
            this.lbl_remote.AutoEllipsis = true;
            this.lbl_remote.Location = new System.Drawing.Point(12, 92);
            this.lbl_remote.Name = "lbl_remote";
            this.lbl_remote.Size = new System.Drawing.Size(350, 30);
            this.lbl_remote.TabIndex = 4;
            this.lbl_remote.Text = "[remote]";
            this.lbl_remote.TextAlign = System.Drawing.ContentAlignment.TopRight;
            // 
            // lbl_direction
            // 
            this.lbl_direction.AutoSize = true;
            this.lbl_direction.Location = new System.Drawing.Point(12, 128);
            this.lbl_direction.Name = "lbl_direction";
            this.lbl_direction.Size = new System.Drawing.Size(52, 13);
            this.lbl_direction.TabIndex = 5;
            this.lbl_direction.Text = global::eyeSync.langs.eyeSync.direction + ":";
            // 
            // cbo_direction
            // 
            this.cbo_direction.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbo_direction.FormattingEnabled = true;
            this.cbo_direction.Items.AddRange(new object[] {
            global::eyeSync.langs.eyeSync.remote+" "+global::eyeSync.langs.eyeSync.to+" "+global::eyeSync.langs.eyeSync.local,
            global::eyeSync.langs.eyeSync.synchronize+" / "+global::eyeSync.langs.eyeSync.merge,
            global::eyeSync.langs.eyeSync.local+" "+global::eyeSync.langs.eyeSync.to+" "+global::eyeSync.langs.eyeSync.remote});
            this.cbo_direction.Location = new System.Drawing.Point(142, 125);
            this.cbo_direction.Name = "cbo_direction";
            this.cbo_direction.Size = new System.Drawing.Size(220, 21);
            this.cbo_direction.TabIndex = 6;
            // 
            // cbo_type
            // 
            this.cbo_type.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbo_type.FormattingEnabled = true;
            this.cbo_type.Items.AddRange(new object[] {
            global::eyeSync.langs.eyeSync.manual,
            global::eyeSync.langs.eyeSync.automatic});
            this.cbo_type.Location = new System.Drawing.Point(142, 152);
            this.cbo_type.Name = "cbo_type";
            this.cbo_type.Size = new System.Drawing.Size(220, 21);
            this.cbo_type.TabIndex = 7;
            this.cbo_type.TextChanged += new System.EventHandler(this.cbo_type_TextUpdate);
            // 
            // lbl_type
            // 
            this.lbl_type.AutoSize = true;
            this.lbl_type.Location = new System.Drawing.Point(12, 155);
            this.lbl_type.Name = "lbl_type";
            this.lbl_type.Size = new System.Drawing.Size(34, 13);
            this.lbl_type.TabIndex = 8;
            this.lbl_type.Text = global::eyeSync.langs.eyeSync.type + ":";
            // 
            // lbl_updaterange
            // 
            this.lbl_updaterange.AutoSize = true;
            this.lbl_updaterange.Location = new System.Drawing.Point(12, 182);
            this.lbl_updaterange.Name = "lbl_updaterange";
            this.lbl_updaterange.Size = new System.Drawing.Size(71, 13);
            this.lbl_updaterange.TabIndex = 9;
            this.lbl_updaterange.Text = global::eyeSync.langs.eyeSync.update_every;
            // 
            // cbo_updaterange
            // 
            this.cbo_updaterange.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbo_updaterange.Enabled = false;
            this.cbo_updaterange.FormattingEnabled = true;
            this.cbo_updaterange.Items.AddRange(new object[] {
            "5 "+global::eyeSync.langs.eyeSync.minutes,
            "10 "+global::eyeSync.langs.eyeSync.minutes,
            "15 "+global::eyeSync.langs.eyeSync.minutes,
            "20 "+global::eyeSync.langs.eyeSync.minutes,
            "30 "+global::eyeSync.langs.eyeSync.minutes,
            "45 "+global::eyeSync.langs.eyeSync.minutes,
            "60 "+global::eyeSync.langs.eyeSync.minutes,
            "2 "+global::eyeSync.langs.eyeSync.hours,
            "3 "+global::eyeSync.langs.eyeSync.hours,
            global::eyeSync.langs.eyeSync.day});
            this.cbo_updaterange.Location = new System.Drawing.Point(142, 179);
            this.cbo_updaterange.Name = "cbo_updaterange";
            this.cbo_updaterange.Size = new System.Drawing.Size(220, 21);
            this.cbo_updaterange.TabIndex = 10;
            // 
            // btn_create
            // 
            this.btn_create.Location = new System.Drawing.Point(142, 238);
            this.btn_create.Name = "btn_create";
            this.btn_create.Size = new System.Drawing.Size(220, 23);
            this.btn_create.TabIndex = 11;
            this.btn_create.Text = global::eyeSync.langs.eyeSync.create_sync_job;
            this.btn_create.UseVisualStyleBackColor = true;
            this.btn_create.Click += new System.EventHandler(this.btn_create_Click);
            // 
            // btn_cancel
            // 
            this.btn_cancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btn_cancel.Location = new System.Drawing.Point(12, 238);
            this.btn_cancel.Name = "btn_cancel";
            this.btn_cancel.Size = new System.Drawing.Size(124, 23);
            this.btn_cancel.TabIndex = 12;
            this.btn_cancel.Text = global::eyeSync.langs.eyeSync.cancel;
            this.btn_cancel.UseVisualStyleBackColor = true;
            this.btn_cancel.Click += new System.EventHandler(this.btn_cancel_Click);
            // 
            // chk_recursive
            // 
            this.chk_recursive.AutoSize = true;
            this.chk_recursive.Location = new System.Drawing.Point(142, 208);
            this.chk_recursive.Name = "chk_recursive";
            this.chk_recursive.Size = new System.Drawing.Size(190, 17);
            this.chk_recursive.TabIndex = 13;
            this.chk_recursive.Text = global::eyeSync.langs.eyeSync.recursive;
            this.chk_recursive.UseVisualStyleBackColor = true;
            // 
            // frm_newsync
            // 
            this.AcceptButton = this.btn_create;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.btn_cancel;
            this.ClientSize = new System.Drawing.Size(374, 273);
            this.Controls.Add(this.chk_recursive);
            this.Controls.Add(this.btn_cancel);
            this.Controls.Add(this.btn_create);
            this.Controls.Add(this.cbo_updaterange);
            this.Controls.Add(this.lbl_updaterange);
            this.Controls.Add(this.lbl_type);
            this.Controls.Add(this.cbo_type);
            this.Controls.Add(this.cbo_direction);
            this.Controls.Add(this.lbl_direction);
            this.Controls.Add(this.lbl_remote);
            this.Controls.Add(this.lbl_with);
            this.Controls.Add(this.lbl_local);
            this.Controls.Add(this.pic_logo);
            this.Controls.Add(this.lbl_sync);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frm_newsync";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = global::eyeSync.langs.eyeSync.synchronize;
            ((System.ComponentModel.ISupportInitialize)(this.pic_logo)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pic_logo;
        private System.Windows.Forms.Label lbl_sync;
        private System.Windows.Forms.Label lbl_local;
        private System.Windows.Forms.Label lbl_with;
        private System.Windows.Forms.Label lbl_remote;
        private System.Windows.Forms.Label lbl_direction;
        private System.Windows.Forms.ComboBox cbo_direction;
        private System.Windows.Forms.ComboBox cbo_type;
        private System.Windows.Forms.Label lbl_type;
        private System.Windows.Forms.Label lbl_updaterange;
        private System.Windows.Forms.ComboBox cbo_updaterange;
        private System.Windows.Forms.Button btn_create;
        private System.Windows.Forms.Button btn_cancel;
        private System.Windows.Forms.CheckBox chk_recursive;
    }
}
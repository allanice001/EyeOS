using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace eyeSync
{
    public partial class frm_userpw : Form
    {
        public string Username
        {
            get { return txt_username.Text; }
        }

        public string Password
        {
            get { return txt_pass.Text; }
        }

        public frm_userpw()
        {
            InitializeComponent();
            lbl_serverlink.Text = "http://" + Config.Server + "/" + Config.ServerDir;
        }

        private void btn_login_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
            Close();
        }

        private void btn_cancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}

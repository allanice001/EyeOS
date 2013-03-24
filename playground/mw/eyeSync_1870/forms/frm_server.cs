using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace eyeSync
{
    public partial class frm_server : Form
    {
        public string ServerURL
        {
            get { return lbl_linkURL.Text; }
        }

        public string Server
        {
            get { return txt_server.Text; }
        }

        public string ServerDir
        {
            get { return txt_subdir.Text; }
        }

        public string ServerSecure
        {
            get { return cbo_secure.SelectedItem.ToString(); }
        }

        public frm_server()
        {
            InitializeComponent();
            cbo_secure.Focus();
            if (Config.HTTPS) this.cbo_secure.SelectedIndex = 1;
            else this.cbo_secure.SelectedIndex = 0;
            txt_TextChanged(null, null);
        }

        private void txt_TextChanged(object sender, EventArgs e)
        {
            if (txt_server.Text.StartsWith("http://"))
            {
                txt_server.Focus();
                txt_server.Text = txt_server.Text.Remove(0, 7);
                cbo_secure.SelectedIndex = 0;
            }
            if (txt_server.Text.StartsWith("https://"))
            {
                txt_server.Focus();
                txt_server.Text = txt_server.Text.Remove(0, 8);
                cbo_secure.SelectedIndex = 1;
            }

            if (txt_server.Text.Contains("/"))
            {
                string[] t = txt_server.Text.Split(new char[] {'/'}, 2);
                txt_server.Focus();
                txt_server.Text = t[0];
                txt_subdir.Focus();
                if (txt_subdir.Text != "" && txt_subdir.Text != txt_subdir.InstructionText)
                    txt_subdir.Text = t[1] + "/" + txt_subdir.Text;
                else
                    txt_subdir.Text = t[1];
            }

            if (txt_subdir.Text.Contains("//"))
            {
                txt_subdir.Focus();
                txt_subdir.Text.Replace("//", "/");
            }

            if (!txt_subdir.Text.EndsWith("/") && txt_subdir.Text != "" && txt_subdir.Text != txt_subdir.InstructionText)
            {
                int pos = txt_subdir.SelectionStart;
                txt_subdir.Focus();
                txt_subdir.Text = txt_subdir.Text + "/";
                txt_subdir.SelectionStart = pos;
            }

            if (txt_server.Text != "" && txt_server.Text != txt_server.InstructionText)
            {
                if (txt_subdir.Text != "" && txt_subdir.Text != txt_subdir.InstructionText)
                    lbl_linkURL.Text = cbo_secure.Text + txt_server.Text + "/" + txt_subdir.Text;
                else
                    lbl_linkURL.Text = cbo_secure.Text + txt_server.Text + "/";
                lbl_linkURL.Visible = true;
            }
            else
            {
                lbl_linkURL.Visible = false;
            }
        }

        private void chk_public_server_CheckedChanged(object sender, EventArgs e)
        {
            if (chk_public_server.Checked == true)
            {
                txt_subdir.Focus();
                txt_subdir.Tag = txt_subdir.Text;
                txt_subdir.Text = "";
                txt_subdir.Enabled = false;
                txt_server.Focus();
                txt_server.Tag = txt_server.Text;
                txt_server.Text = "www.eyeos.info";
                txt_server.Enabled = false;
            }
            else
            {
                txt_subdir.Focus();
                txt_subdir.Text = txt_subdir.Tag.ToString();
                txt_subdir.Enabled = true;
                txt_server.Focus();
                txt_server.Text = txt_server.Tag.ToString();
                txt_server.Enabled = true;
            }
        }

        private void btn_save_Click(object sender, EventArgs e)
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

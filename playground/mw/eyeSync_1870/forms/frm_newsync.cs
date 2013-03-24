using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace eyeSync
{
    public partial class frm_newsync : Form
    {
        public SyncJob GenerateSyncJob()
        {
            return new SyncJob(lbl_local.Text, lbl_remote.Text, cbo_direction.Text, cbo_type.Text, cbo_updaterange.Text,chk_recursive.Checked);
        }

        public frm_newsync(string local, string remote)
        {
            InitializeComponent();
            lbl_local.Text = local;
            lbl_remote.Text = remote;
            cbo_direction.SelectedItem = cbo_direction.Items[2];
            cbo_type.SelectedItem = cbo_type.Items[0];
            cbo_updaterange.SelectedItem = cbo_updaterange.Items[0];

        }

        private void cbo_type_TextUpdate(object sender, EventArgs e)
        {
            if (cbo_type.SelectedItem == cbo_type.Items[1]) cbo_updaterange.Enabled = true;
            else cbo_updaterange.Enabled = false;
        }

        private void btn_create_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
            this.Close();
        }

        private void btn_cancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            this.Close();
        }
    }
}

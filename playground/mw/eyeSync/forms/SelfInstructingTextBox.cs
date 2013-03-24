using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;
using System.Drawing;

namespace eyeSync
{
    class SelfInstructingTextBox : TextBox
    {
        private string instructionText;

        public string InstructionText
        {
            get { return instructionText; }
            set { instructionText = value; OnLostFocus(new EventArgs()); }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
        }

        protected override void OnGotFocus(EventArgs e)
        {
            if (Text == InstructionText && ForeColor == SystemColors.GrayText)
            {
                Text = "";
                ForeColor = SystemColors.WindowText;
            }
            base.OnGotFocus(e);
        }

        protected override void OnLostFocus(EventArgs e)
        {
            if (Text == "")
            {
                Text = InstructionText;
                ForeColor = SystemColors.GrayText;
            }
            base.OnLostFocus(e);
        }
    }
}

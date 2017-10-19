using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Sms.Model
{
    public class smsMx
    {
        public int ID { get; set; }
        public string StreamNo { get; set; }
        public string Mobile { get; set; }
        public string Content { get; set; }
        public int State { get; set; }
        public string ErrMsg { get;set; }
        public DateTime AddOn { get; set; }
        public DateTime SendOn { get; set; }
        public string customMsgID { get; set; }
    }
}

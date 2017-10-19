using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Sms.Model
{
    public class smsStream
    {
        public int ID { get; set; }
        public string StreamNo { get; set; }
        public int AdminID { get; set; }
        public int ChannelID { get; set; }
        public string Mobiles { get; set; }
        public int MobileNum { get; set; }
        public string Content { get; set; }
        public int FeeNum { get; set; }
        public int State { get; set; }
        public DateTime AddOn { get; set; }
        public string SendName { get; set; }
        public int SendType { get; set; }
        public int Grade { get; set; }

    }
}

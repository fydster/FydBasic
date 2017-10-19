using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Basic.Model
{
    public class ShortInfo
    {
        public int ID { get; set; }
        public int AdminID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime AddOn { get; set; }
        public int Enable { get; set; }
    }
}

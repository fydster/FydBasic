using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Data;

namespace Rtdl.Sms.Data
{
    public class _SmsMx:DbCenter
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<smsMx> GetSmsMxList(string StreamNo,int State)
        {
            List<smsMx> le = null;
            string sql = "select * from tbl_sms_mx where StreamNo = '" + StreamNo + "' and State = " + State + " order by AddOn asc";
            if (State == -1)
            {
                sql = "select * from tbl_sms_mx where StreamNo = '" + StreamNo + "' order by AddOn asc";
            }
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        le = new List<smsMx>();
                        foreach (DataRow r in dt.Rows)
                        {
                            smsMx e = new smsMx
                            {
                                ID = Convert.ToInt16(r["id"]),
                                StreamNo = r["StreamNo"].ToString(),
                                Mobile = r["Mobile"].ToString(),
                                Content = r["Content"].ToString(),
                                ErrMsg = r["ErrMsg"].ToString(),
                                State = Convert.ToInt16(r["State"]),
                                AddOn = Convert.ToDateTime(r["addOn"]),
                                customMsgID = r["customMsgID"].ToString()
                            };
                            try
                            {
                                e.SendOn = Convert.ToDateTime(r["SendOn"]);
                            }
                            catch
                            {
                                e.SendOn = DateTime.Now;
                            }
                            le.Add(e);
                        }
                    }
                }
            }
            catch
            {

            }
            
            return le;
        }


        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<smsMx> GetSmsMxList()
        {
            List<smsMx> le = null;
            string sql = "select * from tbl_sms_mx where State = 0 order by Grade desc,AddOn asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<smsMx>();
                    foreach (DataRow r in dt.Rows)
                    {
                        smsMx e = new smsMx
                        {
                            ID = Convert.ToInt16(r["id"]),
                            StreamNo = r["StreamNo"].ToString(),
                            Mobile = r["Mobile"].ToString(),
                            ErrMsg = r["ErrMsg"].ToString(),
                            State = Convert.ToInt16(r["State"]),
                            AddOn = Convert.ToDateTime(r["addOn"]),
                            SendOn = Convert.ToDateTime(r["SendOn"]),
                            customMsgID = r["customMsgID"].ToString()
                        };
                        le.Add(e);
                    }
                }
            }
            return le;
        }
    }
}

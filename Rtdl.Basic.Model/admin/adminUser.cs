using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Basic.Model
{
    public class adminUser
    {
        public int ID { get; set; }
        /// <summary>
        /// 企业名称
        /// </summary>
        public string CorpName { get; set; }
        /// <summary>
        /// 后台登陆用户名
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// 后台登陆密码
        /// </summary>
        public string LoginPass { get; set; }
        /// <summary>
        /// 联系电话
        /// </summary>
        public string Mobile { get; set; }
        /// <summary>
        /// 联系人
        /// </summary>
        public string Contact { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime AddOn { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int Enable { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Memo { get; set; }
        /// <summary>
        /// 菜单权限
        /// </summary>
        public string Limits { get; set; }
        /// <summary>
        /// 角色ID
        /// </summary>
        public int RoleID { get; set; }
        /// <summary>
        /// 账户余额
        /// </summary>
        public int Account { get; set; }
    }
}

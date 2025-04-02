import { useEffect } from "react";

const usePermissionReload = (permission: PermissionName = "microphone") => {
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: permission })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") {
              window.location.reload();
            }
          };
        })
        .catch((err) => {
          console.error("Permission query 에러:", err);
        });
    }
  }, [permission]);
};

export default usePermissionReload;
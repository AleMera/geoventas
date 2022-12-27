import { FormGroup } from "@angular/forms";


export function confirmPasswd(passwd1: string) {
    return (formGroup: FormGroup) => {
        const passwd = formGroup.controls[passwd1];
        const passwd2 = formGroup.controls['passwd2'];
        if (passwd.value !== passwd2.value) {
            passwd2.setErrors({ confirmPasswd: true });
        } else {
            passwd2.setErrors(null);
        }
    }
}
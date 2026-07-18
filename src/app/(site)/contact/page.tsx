import { redirect } from "next/navigation";

/** One-pager: the contact experience lives as the #contact section of the
 *  home page. This route just sends visitors there. */
export default function Page() {
  redirect("/#contact");
}

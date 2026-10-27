import type { Metadata } from "next";
import { InkSpecs, InkTitle, type Spec } from "../ink-specs";
import { links } from "../site";

const description = "Joe Sluis is a software engineer on the Azure HorizonDB engine team, into systems programming and databases.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description, url: "/about" },
};

const asciiArt = String.raw`    -+#%%%#*+-     :+#@@@@%#*@@@@@@@@@@@%=
    -@@#=.      :=*%@@@+:       .   ..::..   -%@@:
  :@%  -*#%%%%%%#*+.  .=#%%%%%%%#=.  :#%%%%%%+: .@@=
 +@. +%%%%%%%%%%%%= .%%%%%%%%%%%%%%%#:  *%%%%%%%+  @@
 @: #%%%%%%%%%%%%- +%%%%%%%%%%%%%%%%%%%- .%%%%%%%%  @%
@@ -%%%%%%%%%%%%* =%%%%%%%%%%%%%%%%%%%%%#  #%%%%%%= @@
@% *%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%- @@
@% *%%%%%%%%%%%% =*=::::=%%%%%%%%%%%%#-.    .%%%%%  @*
@@ =%%%%%%%%%%%%   :+::.  %%%%%%%%%%* :..=#  %%%%* *@
=@  %%%%%%%%%%%@ *%%%#::%  %%%%%%%%%  %##%* =%%%%  @%
 @* #%%%%%%%%%%@ +%%%%%%%  %%%%%%%%%+ #%%%= %%%%+ %@
 #@ .%%%%%%%%%%@ *%%%%%%%  %%%%%%%%%%  %%%+ *%%# :@:
  @= #%%%%%%%%%- #%%%%%%%  %%%%%%%%%%#  %%# :%%  @%
  #@  %%%%%%%%%: #%%%%%%% .%%%%%%%%%%%#  %% .%  @@
   @% +%%%%%%%%@  %%%%%%  %%%%%%%%%%%%%%  + +  @@
   :@: #%%%%%%%%+  *%%%. %%%%%%%%%%%%%%%%     @@
    %@  %%%%%%%%%=   .:  :#%%%%%%%%%%%%%%*   @@@@#**@#
     @@  %%%%%%#  %@@@: -: :%%%%%%%%%%%%- -+:::::   @@
      @@  *%%%: ++=-  :%%+  %%%%%%%%%%%%  ::::.  :#@%
       =@%    +@*  ::::.    %%%%%%%%%%%% .@%%@@@@*-
         =@@@@*-@@@%###@@@  %%%%%%%%%%%# #@
                    ..   @  %%%%%%%%%%%+ @@
                         @  %%%%%%%%%%%  @#
                         @  %%%%%%%%%%% .@
                         %@ %%%%%%%%%%= @@
                          @  #%%%%%%%: *@
                           @*  .:.   +@*
                            =@@@@@@@*:`;

const specs: Spec[] = [
  { label: "Name", ja: "名前", value: "Joe Sluis" },
  { label: "Role", ja: "職業", value: "Software engineer" },
  { label: "Team", ja: "所属", value: "Azure HorizonDB engine team" },
  { label: "Interests", ja: "興味", value: "Systems programming, databases, soccer" },
  { label: "Email", ja: "連絡", value: <a href={`mailto:${links.email}`}>{links.email}</a> },
  { label: "GitHub", value: <a href={links.github} target="_blank" rel="noopener noreferrer">JoeS51</a> },
  { label: "LinkedIn", value: <a href={links.linkedin} target="_blank" rel="noopener noreferrer">joesluis</a> },
];

export default function Page() {
  return (
    <div className="ink-sheet">
      <InkTitle ja="アバウト" title="About" />
      <p className="ink-prose">
        Hey! Thanks for checking out my page. I&apos;m Joe, a software engineer interested in systems programming and mostly databases.
        I&apos;m on the Azure HorizonDB engine team, working on databases full time. I also occasionally write articles and make funny projects.
        Reach out for anything. Cheers.
      </p>
      <InkSpecs specs={specs} />
      <figure className="ink-ascii" role="img" aria-label="ASCII art of the PostgreSQL elephant">
        <pre aria-hidden="true">{asciiArt}</pre>
      </figure>
    </div>
  );
}
